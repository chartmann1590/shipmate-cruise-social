import React from 'react';
import { useCruise } from '../../context/CruiseContext';
import { Newspaper, Calendar, MessageSquare, Compass, Anchor, Ship, Award, Users, MapPin } from '../Icons';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { activeShip, userProfile, currentDeckLocation } = useCruise();
  const profile = userProfile || { name: 'Guest cruiser', avatar: '/favicon.svg', loyaltyTier: 'Sign in to join' };

  const navItems = [
    { id: 'feed', label: 'Sea Feed & Stories', icon: Newspaper },
    { id: 'itinerary', label: 'My Cruise Schedule', icon: Calendar },
    { id: 'chats', label: 'Direct & Group Chats', icon: MessageSquare },
    { id: 'tools', label: 'Ship Companion Tools', icon: Compass },
    { id: 'profile', label: 'Cruiser Profile & Pass', icon: Anchor }
  ];

  return (
    <aside className="desktop-sidebar">
      {/* Active Sailing Widget */}
      <div style={{
        padding: '16px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Ship size={18} className="text-sky-400" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Sailing
          </span>
        </div>
        <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '4px' }}>{activeShip.name}</h4>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px' }}>{activeShip.dates}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#e2e8f0' }}>
          <MapPin size={12} className="text-teal-400" />
          <span>{currentDeckLocation}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map(item => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(3, 105, 161, 0.2) 100%)' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                fontSize: '0.92rem',
                fontWeight: isActive ? 700 : 500,
                textAlign: 'left'
              }}
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Loyalty Summary Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <img 
          src={profile.avatar}
          alt={profile.name}
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {profile.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={12} />
            <span>{profile.loyaltyTier}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
