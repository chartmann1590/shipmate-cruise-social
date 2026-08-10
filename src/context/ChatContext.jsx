import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  subscribeToGroups,
  subscribeToMessages,
  createMessage,
  createGroup as createRemoteGroup,
  updateGroupPreview
  ,joinGroupByInvite
  ,createCall,
  createNotification
} from '../services/firebase';
import { notifyShipmate } from '../services/notifications';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatType, setActiveChatType] = useState('group');
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [error, setError] = useState('');
  const messageCounts = React.useRef({});

  useEffect(() => {
    if (!currentUser?.id) {
      setGroups([]);
      setActiveChatId(null);
      return () => {};
    }
    return subscribeToGroups(currentUser.id, (items) => {
      setGroups(items.map((group) => ({ ...group, avatar: group.avatar || '⚓', inviteCode: group.inviteCode || group.id.slice(0, 8).toUpperCase() })));
      setActiveChatId((current) => current || items[0]?.id || null);
    }, (snapshotError) => setError(snapshotError.message));
  }, [currentUser?.id]);

  useEffect(() => {
    if (!activeChatId || activeChatType !== 'group') return () => {};
    return subscribeToMessages(activeChatId, (items) => {
      const previousCount = messageCounts.current[activeChatId] || 0;
      const latest = items[items.length - 1];
      if (items.length > previousCount && latest && latest.senderId !== currentUser?.id) {
        notifyShipmate(`New message in ${groups.find((group) => group.id === activeChatId)?.name || 'ShipMate'}`, latest.text).catch(() => {});
      }
      messageCounts.current[activeChatId] = items.length;
      setMessages((current) => ({ ...current, [activeChatId]: items.map((message) => ({
        ...message,
        isMe: message.senderId === currentUser?.id,
        time: message.createdAt?.toDate ? message.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'
      })) }));
    }, (snapshotError) => setError(snapshotError.message));
  }, [activeChatId, activeChatType, currentUser?.id]);

  const sendMessage = async (chatId, text, user) => {
    if (!text.trim() || !chatId || !user?.id) return;
    await createMessage(chatId, {
      senderId: user.id,
      senderName: user.name,
      avatar: user.avatar || '/favicon.svg',
      text: text.trim()
    });
    await updateGroupPreview(chatId, { lastMessage: `${user.name.split(' ')[0]}: ${text.trim()}`, lastTime: 'Just now' });
    const group = groups.find((item) => item.id === chatId);
    await Promise.all((group?.memberIds || []).filter((memberId) => memberId !== user.id).map((memberId) => createNotification(memberId, { type: 'message', actorName: user.name, text: `${user.name} sent a message in ${group.name}.`, url: '/?tab=chats' })));
  };

  const createGroup = async ({ name, category, ship, avatarSymbol, sailingId, visibility }) => {
    if (!currentUser?.id) return;
    const id = await createRemoteGroup({ name, category, ship, avatar: avatarSymbol, uid: currentUser.id, sailingId, visibility });
    setActiveChatId(id);
    setActiveChatType('group');
    setIsNewGroupModalOpen(false);
  };

  const joinGroup = async (inviteCode) => {
    if (!currentUser?.id) throw new Error('Sign in before joining a group.');
    const group = await joinGroupByInvite(inviteCode, currentUser.id);
    setActiveChatId(group.id);
    setActiveChatType('group');
    return group;
  };

  const startCall = async (groupId, type = 'voice') => {
    if (!currentUser?.id) throw new Error('Sign in before starting a call.');
    const call = await createCall(groupId, { callerId: currentUser.id, callerName: currentUser.name, type, callerReady: false, offer: null, answer: null, callerCandidates: [], calleeCandidates: [] });
    await updateGroupPreview(groupId, { currentCallId: call.id, currentCallType: type });
    return call.id;
  };

  return (
    <ChatContext.Provider value={{
      groups,
      messages,
      activeChatId,
      setActiveChatId,
      activeChatType,
      setActiveChatType,
      sendMessage,
      createGroup,
      joinGroup,
      startCall,
      isNewGroupModalOpen,
      setIsNewGroupModalOpen,
      directUsers: [],
      error
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
