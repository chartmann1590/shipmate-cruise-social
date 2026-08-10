import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app, savePushToken } from './firebase';

export const requestNotificationPermission = async () => {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return 'unsupported';
  const permission = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
  return permission;
};

export const registerPushNotifications = async (uid, onMessageReceived) => {
  const permission = await requestNotificationPermission();
  if (permission !== 'granted' || !app || !uid) return permission;
  const messaging = getMessaging(app);
  const registration = await navigator.serviceWorker.ready;
  const token = await getToken(messaging, { serviceWorkerRegistration: registration });
  if (token) await savePushToken(uid, token);
  onMessage(messaging, (payload) => onMessageReceived?.(payload));
  return token ? 'granted' : 'unavailable';
};

export const notifyShipmate = async (title, body, url = '/?tab=chats') => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return false;
  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(title, { body, icon: '/favicon.svg', badge: '/favicon.svg', data: { url }, tag: 'shipmate-message' });
  return true;
};
