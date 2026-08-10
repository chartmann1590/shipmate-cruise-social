import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useCruise } from '../../context/CruiseContext';
import { MessageSquare, Users, Send, Plus, Copy, Check, Sparkles } from '../Icons';
import { GroupInviteModal } from '../Modals/GroupInviteModal';
import { JoinGroupModal } from '../Modals/JoinGroupModal';
import { CallPanel } from './CallPanel';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';

export const ChatHub = () => {
  const { 
    groups, 
    messages, 
    activeChatId, 
    setActiveChatId, 
    activeChatType, 
    setActiveChatType, 
    sendMessage, 
    directUsers,
    setIsNewGroupModalOpen,
    joinGroup,
    startCall,
    sendVoiceNote
  } = useChat();

  const { userProfile, activeShip } = useCruise();
  const [inputText, setInputText] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(() => Boolean(new URLSearchParams(window.location.search).get('join')));
  const [joinCode] = useState(() => new URLSearchParams(window.location.search).get('join') || '');
  const messagesEndRef = useRef(null);

  const activeGroup = groups.find(g => g.id === activeChatId);
  const activeUser = directUsers.find(u => u.id === activeChatId);

  const activeMessages = messages[activeChatId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(activeChatId, inputText, userProfile);
    setInputText('');
  };

  const handleVoiceNote = (audioData, mimeType, duration) => sendVoiceNote(activeChatId, audioData, mimeType, userProfile, duration);

  const handleCopyInvite = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleCall = async (type) => {
    try { await startCall(activeChatId, type); } catch (error) { window.alert(error.message); }
  };

  return (
    <div className="chat-container">
      {/* Sidebar List */}
      <div className="glass-panel chat-sidebar" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Cruise Chats</h3>
           <button
            onClick={() => setIsNewGroupModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.2)',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 700
            }}
          >
            <Plus size={14} />
            <span>New Group</span>
           </button>
           <button className="join-group-trigger" onClick={() => setIsJoinOpen(true)}>Join</button>
        </div>

        {/* Channels List */}
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '4px 6px' }}>
            Group Channels
          </div>
          {groups.map(group => {
            const isActive = activeChatId === group.id;
            return (
              <div
                key={group.id}
                onClick={() => {
                  setActiveChatId(group.id);
                  setActiveChatType('group');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(3, 105, 161, 0.15) 100%)' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '1.4rem' }}>{group.avatar}</div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {group.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {group.lastMessage}
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '12px 6px 4px 6px' }}>
            Direct Messages (1-on-1)
          </div>
          {directUsers.map(user => {
            const isActive = activeChatId === user.id;
            return (
              <div
                key={user.id}
                onClick={() => {
                  setActiveChatId(user.id);
                  setActiveChatType('dm');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(3, 105, 161, 0.15) 100%)' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <img src={user.avatar} alt={user.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#2dd4bf' }}>{user.location}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Active Chat Area */}
      <div className="glass-panel chat-main">
        {/* Chat Top Banner */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 25, 44, 0.7)'
        }}>
          {activeChatType === 'group' && activeGroup ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '1.6rem' }}>{activeGroup.avatar}</div>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1rem' }}>{activeGroup.name}</h4>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#38bdf8' }}>{activeGroup.membersCount} Sailors Joined</span>
                  <span>•</span>
                  <span>Code: {activeGroup.inviteCode}</span>
                </div>
              </div>
            </div>
          ) : activeUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={activeUser.avatar} alt={activeUser.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h4 style={{ color: '#fff', fontSize: '1rem' }}>{activeUser.name}</h4>
                <div style={{ fontSize: '0.78rem', color: '#fbbf24' }}>{activeUser.loyaltyTier}</div>
              </div>
            </div>
          ) : null}

          {/* Copy Invite Code */}
          {activeChatType === 'group' && activeGroup && (
            <div className="chat-header-actions">
            <button className="chat-action-button" onClick={() => setIsInviteOpen(true)}>
              <span>Share invite</span>
            </button>
            <button className="chat-action-button" onClick={() => handleCall('voice')}>Voice</button>
            <button className="chat-action-button" onClick={() => handleCall('video')}>Video</button>
            <button
              onClick={() => handleCopyInvite(activeGroup.inviteCode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: copiedInvite ? '#2dd4bf' : '#e2e8f0',
                border: '1px solid var(--border-glass)',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              {copiedInvite ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedInvite ? 'Invite Copied!' : 'Copy Code'}</span>
            </button>
            </div>
          )}
        </div>

        {activeGroup && <CallPanel group={activeGroup} user={userProfile} />}

        {/* Messages Stream */}
        <div className="chat-messages-area">
          {activeMessages.map((msg, index) => {
            const isMe = msg.isMe;
            return (
              <div
                key={msg.id || index}
                className={`chat-bubble ${isMe ? 'me' : 'other'}`}
              >
                {!isMe && (
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', marginBottom: '2px' }}>
                    {msg.senderName}
                  </div>
                )}
                <div>{msg.audioData ? <audio className="voice-note-player" controls preload="metadata" src={msg.audioData} aria-label={`Voice note from ${msg.senderName}`} /> : msg.text}</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>
                  {msg.time}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="chat-input-bar">
          <input
            type="text"
            placeholder="Type a message to fellow cruisers..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="chat-input-field"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: inputText.trim() ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={18} />
          </button>
          <VoiceNoteRecorder onSend={handleVoiceNote} />
        </form>
      </div>
      {isInviteOpen && activeGroup && <GroupInviteModal group={activeGroup} onClose={() => setIsInviteOpen(false)} />}
      {isJoinOpen && <JoinGroupModal initialCode={joinCode} onJoin={joinGroup} onClose={() => setIsJoinOpen(false)} />}
    </div>
  );
};
