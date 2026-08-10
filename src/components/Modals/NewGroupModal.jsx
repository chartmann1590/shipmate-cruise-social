import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useCruise } from '../../context/CruiseContext';
import { Plus, X, Users, Sparkles } from '../Icons';

export const NewGroupModal = () => {
  const { isNewGroupModalOpen, setIsNewGroupModalOpen, createGroup } = useChat();
  const { activeShip, activeSailingId } = useCruise();

  const [groupName, setGroupName] = useState('');
  const [category, setCategory] = useState('Port Excursions');
  const [avatarSymbol, setAvatarSymbol] = useState('🚢');
  const [visibility, setVisibility] = useState('private');

  if (!isNewGroupModalOpen) return null;

  const emojis = ['🚢', '🏝️', '🍹', '🥂', '🧭', '🏊‍♂️', '🎹', '🌴', '💃', '🍔'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    createGroup({
      name: groupName.trim(),
      category,
      ship: activeShip.name,
      sailingId: activeSailingId,
      avatarSymbol
      ,visibility
    });

    setGroupName('');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewGroupModalOpen(false)}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} className="text-sky-400" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Create Cruise Group Chat</h3>
          </div>
          <button onClick={() => setIsNewGroupModalOpen(false)} style={{ background: 'transparent', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Group Icon Emoji</label>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {emojis.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarSymbol(emoji)}
                  style={{
                    fontSize: '1.4rem',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: avatarSymbol === emoji ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: avatarSymbol === emoji ? '1px solid #38bdf8' : '1px solid transparent'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Who can find this group?</label>
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)} style={{ width: '100%', background: '#0f172a', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}>
              <option value="private">Private: invite link only</option>
              <option value="public">Public: visible to cruisers on this sailing</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Group Chat Name</label>
            <input
              type="text"
              placeholder="e.g. Adults Only Solarium Party or Cozumel Taxi Sharing"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Group Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff'
              }}
            >
              <option value="Port Excursions">Port Excursions & Buddy Pairing</option>
              <option value="Social Meetups">Social Meetups & Deck Parties</option>
              <option value="Activities & Trivia">Activities & Trivia Squad</option>
              <option value="Dining & Drinks">Dining & Specialty Drinks</option>
              <option value="Solo Travelers">Solo Travelers</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '10px',
              padding: '12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.92rem',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)'
            }}
          >
            Create & Launch Group Chat
          </button>
        </form>
      </div>
    </div>
  );
};
