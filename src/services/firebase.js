import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signOut
} from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const configReady = Object.values(firebaseConfig).every(Boolean);
const app = configReady ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
}) : null;

export { app, auth, db, configReady, onAuthStateChanged, signOut };

const profileFromUser = (user, data = {}) => ({
  id: user.uid,
  name: data.name || user.displayName || user.email?.split('@')[0] || 'Cruiser',
  email: user.email || '',
  handle: data.handle || `@${(user.displayName || user.email?.split('@')[0] || 'cruiser').toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
  avatar: data.avatar || '/favicon.svg',
  coverPhoto: data.coverPhoto || '/hero_banner.jpg',
  bio: data.bio || 'Planning the next port call.',
  loyaltyLine: data.loyaltyLine || 'Independent cruiser',
  loyaltyLineCode: data.loyaltyLineCode || '',
  loyaltyTier: data.loyaltyTier || 'New on board',
  loyaltyPoints: data.loyaltyPoints || 0,
  cabinNumber: data.cabinNumber || '',
  reservationCode: data.reservationCode || '',
  currentShipName: data.currentShipName || '',
  currentShipId: data.currentShipId || '',
  cruiseStartDate: data.cruiseStartDate || '',
  cruiseEndDate: data.cruiseEndDate || '',
  sailingId: data.sailingId || '',
  badges: data.badges || [],
  location: data.location || '',
  drinkCount: data.drinkCount || 0,
  drinkLimit: data.drinkLimit || 15,
  itinerary: data.itinerary || [],
  sailings: data.sailings || [],
  activeSailingId: data.activeSailingId || '',
  profileVisibility: data.profileVisibility || 'private'
});

export const getUserProfile = async (user) => {
  if (!db || !user) return profileFromUser(user);
  const snapshot = await getDoc(doc(db, 'users', user.uid));
  return profileFromUser(user, snapshot.exists() ? snapshot.data() : {});
};

export const registerUser = async (email, password, displayName, shipName = '') => {
  if (!auth || !db) throw new Error('Firebase is not configured. Add the VITE_FIREBASE values and reload.');
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  const profile = profileFromUser(credential.user, {
    name: displayName,
    currentShipName: shipName,
    sailingId: shipName ? `${shipName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-2026` : ''
  });
  await setDoc(doc(db, 'users', credential.user.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return profile;
};

export const loginUser = async (email, password) => {
  if (!auth) throw new Error('Firebase is not configured. Add the VITE_FIREBASE values and reload.');
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return getUserProfile(credential.user);
};

export const loginWithGoogle = async () => {
  if (!auth || !db) throw new Error('Firebase is not configured. Add the VITE_FIREBASE values and reload.');
  const credential = await signInWithPopup(auth, new GoogleAuthProvider());
  const profileRef = doc(db, 'users', credential.user.uid);
  const existing = await getDoc(profileRef);
  if (!existing.exists()) {
    const profile = profileFromUser(credential.user);
    await setDoc(profileRef, { ...profile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return profile;
  }
  return profileFromUser(credential.user, existing.data());
};

export const saveUserProfile = (uid, changes) => {
  if (!db) throw new Error('Firebase is not configured.');
  return updateDoc(doc(db, 'users', uid), { ...changes, updatedAt: serverTimestamp() });
};

export const savePushToken = (uid, token) => setDoc(doc(db, 'users', uid, 'pushTokens', token), { token, createdAt: serverTimestamp(), userAgent: navigator.userAgent });

export const savePushSubscription = (uid, subscription) => {
  const id = encodeURIComponent(subscription.endpoint).slice(0, 500);
  return setDoc(doc(db, 'users', uid, 'pushSubscriptions', id), { ...subscription, createdAt: serverTimestamp(), userAgent: navigator.userAgent });
};

export const createNotification = (uid, data) => {
  if (!uid || !db) return Promise.resolve();
  const notification = { ...data, actorId: auth?.currentUser?.uid || '', recipientId: uid, read: false, sent: false, createdAt: serverTimestamp() };
  return Promise.all([addDoc(collection(db, 'users', uid, 'notifications'), notification), addDoc(collection(db, 'notificationOutbox'), notification)]);
};

export const subscribeToNotifications = (uid, onChange, onError) => {
  if (!db || !uid) return () => {};
  return onSnapshot(query(collection(db, 'users', uid, 'notifications'), where('read', '==', false), limit(20)), (snapshot) => onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))), onError);
};

export const createSupportTicket = (data) => addDoc(collection(db, 'supportTickets'), {
  ...data,
  status: 'open',
  createdAt: serverTimestamp()
});

export const subscribeToSupportTickets = (uid, onChange, onError) => {
  if (!db || !uid) return () => {};
  return onSnapshot(query(collection(db, 'supportTickets'), where('createdBy', '==', uid), limit(25)), (snapshot) => onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))), onError);
};

export const subscribeToPosts = (sailingId, onChange, onError) => {
  if (!db || !sailingId) return () => {};
  const postsQuery = query(
    collection(db, 'posts'),
    where('sailingId', '==', sailingId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  return onSnapshot(postsQuery, (snapshot) => {
    onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  }, onError);
};

export const createPost = (data) => addDoc(collection(db, 'posts'), {
  ...data,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});

export const updatePost = (postId, changes) => updateDoc(doc(db, 'posts', postId), {
  ...changes,
  updatedAt: serverTimestamp()
});

export const removePost = (postId) => deleteDoc(doc(db, 'posts', postId));

export const subscribeToGroups = (uid, onChange, onError) => {
  if (!db || !uid) return () => {};
  return onSnapshot(query(collection(db, 'groups'), where('memberIds', 'array-contains', uid), limit(50)), (snapshot) => {
    onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  }, onError);
};

export const subscribeToMessages = (groupId, onChange, onError) => {
  if (!db || !groupId) return () => {};
  return onSnapshot(query(collection(db, 'groups', groupId, 'messages'), orderBy('createdAt', 'asc'), limit(200)), (snapshot) => {
    onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  }, onError);
};

export const createGroup = async ({ name, category, ship, avatar, uid, sailingId, visibility = 'private' }) => {
  const inviteCode = `SAIL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const group = await addDoc(collection(db, 'groups'), {
    name,
    category: category || 'Meetup',
    ship: ship || '',
    avatar: avatar || '⚓',
    createdBy: uid,
    sailingId: sailingId || '',
    visibility,
    inviteCode,
    memberIds: [uid],
    membersCount: 1,
    createdAt: serverTimestamp(),
    lastMessage: 'Channel created. Say hello.',
    lastTime: 'Now'
  });
  await setDoc(doc(db, 'groups', group.id, 'members', uid), { joinedAt: serverTimestamp() });
  await setDoc(doc(db, 'groupInvites', inviteCode), { groupId: group.id, inviteCode, name, visibility, sailingId: sailingId || '', createdAt: serverTimestamp() });
  return group.id;
};

export const createMessage = (groupId, data) => addDoc(collection(db, 'groups', groupId, 'messages'), {
  ...data,
  createdAt: serverTimestamp(),
  audioExpiresAt: data.audioData ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null
});

export const updateGroupPreview = (groupId, data) => updateDoc(doc(db, 'groups', groupId), data);

export const joinGroupByInvite = async (inviteCode, uid) => {
  const normalizedCode = inviteCode.trim().toUpperCase();
  const invite = await getDoc(doc(db, 'groupInvites', normalizedCode));
  let group;
  let data;
  if (invite.exists()) {
    group = { id: invite.data().groupId, ref: doc(db, 'groups', invite.data().groupId) };
    data = invite.data();
  } else {
    const snapshot = await getDocs(query(collection(db, 'groups'), limit(100)));
    const legacy = snapshot.docs.find((item) => (item.data().inviteCode || item.id.slice(0, 8).toUpperCase()) === normalizedCode);
    if (!legacy) throw new Error('That invite is not valid or has expired.');
    group = legacy;
    data = legacy.data();
  }
  if (!group) throw new Error('That invite is not valid or has expired.');
  const members = data.memberIds || [];
  if (!members.includes(uid)) {
    await updateDoc(group.ref, { memberIds: arrayUnion(uid), membersCount: increment(1) });
    await setDoc(doc(db, 'groups', group.id, 'members', uid), { joinedAt: serverTimestamp() });
  }
  return { id: group.id, ...data };
};

export const createCall = (groupId, data) => addDoc(collection(db, 'groups', groupId, 'calls'), {
  ...data,
  createdAt: serverTimestamp(),
  status: 'ringing'
});

export const subscribeToCall = (groupId, callId, onChange, onError) => {
  if (!db || !groupId || !callId) return () => {};
  return onSnapshot(doc(db, 'groups', groupId, 'calls', callId), (snapshot) => {
    if (snapshot.exists()) onChange({ id: snapshot.id, ...snapshot.data() });
  }, onError);
};

export const updateCall = (groupId, callId, changes) => updateDoc(doc(db, 'groups', groupId, 'calls', callId), changes);

export const addCallCandidate = (groupId, callId, field, candidate) => updateDoc(doc(db, 'groups', groupId, 'calls', callId), {
  [field]: arrayUnion(candidate)
});

export const setEventAttendance = (sailingId, eventId, uid, joined) => {
  const attendanceRef = doc(db, 'sailings', sailingId, 'eventAttendance', uid);
  return updateDoc(attendanceRef, { eventIds: joined ? arrayUnion(eventId) : arrayRemove(eventId) });
};
