import React from 'react';
import { Newspaper, Calendar, MessageSquare, Compass, Anchor } from '../Icons';

export const MobileNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Newspaper },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'chats', label: 'Chats', icon: MessageSquare },
    { id: 'tools', label: 'Tools', icon: Compass },
    { id: 'profile', label: 'Profile', icon: Anchor }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map(item => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <IconComponent size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
