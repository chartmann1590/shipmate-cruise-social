import React, { useState } from 'react';
import { useCruise } from '../../context/CruiseContext';
import { Wine, MapPin, Compass, Users, Ship, Plus, Minus } from '../Icons';

export const CruiseToolsView = () => {
  const { activeShip, userProfile, drinkCount, updateDrinkCount, currentDeckLocation, updateLocation, mockVenues } = useCruise();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  const drinkLimit = userProfile?.drinkLimit || 15;
  const drinkPercent = Math.min(100, Math.round((drinkCount / drinkLimit) * 100));

  const buddyExcursions = [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Tool 1: Drink Package Counter Widget */}
      <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #14b8a6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Wine size={20} className="text-teal-400" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Drink Package Tracker</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Track your daily beverages (Beverage Package Verified 🥂)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => updateDrinkCount(-1)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Minus size={18} />
            </button>

            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>{drinkCount}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>of {drinkLimit} limit</div>
            </div>

            <button
              onClick={() => updateDrinkCount(1)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(20, 184, 166, 0.4)'
              }}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '16px', background: 'rgba(255, 255, 255, 0.08)', height: '10px', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${drinkPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #14b8a6 0%, #38bdf8 100%)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Tool 2: Onboard Location Sharer */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <MapPin size={20} className="text-sky-400" />
          <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Update Onboard Location</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
          Let friends and group chat members know where you are lounging on {activeShip.name}:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {mockVenues.map(venue => {
            const isCurrent = currentDeckLocation.includes(venue.name);
            return (
              <div
                key={venue.id}
                onClick={() => updateLocation(`${venue.name} - ${venue.deck}`)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: isCurrent ? 'rgba(2, 132, 199, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  border: isCurrent ? '1px solid #38bdf8' : '1px solid var(--border-glass)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 700, color: isCurrent ? '#38bdf8' : '#fff', fontSize: '0.9rem' }}>
                  {venue.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {venue.deck} • {venue.type}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tool 3: Excursion Buddy Finder */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} className="text-amber-400" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Excursion Buddy Matcher</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Pair up with fellow cruisers for shore adventures & taxi splits!
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {!buddyExcursions.length && <div className="empty-state"><strong>No shore meetups yet</strong><span>Link your sailing and create the first excursion group for your shipmates.</span></div>}
          {buddyExcursions.map(ex => (
            <div
              key={ex.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={ex.avatar} alt={ex.organizer} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{ex.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Hosted by {ex.organizer} • <span style={{ color: '#2dd4bf' }}>{ex.port}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert(`Joined ${ex.title} with ${ex.organizer}!`)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.82rem'
                }}
              >
                Pair Up ({ex.spotsLeft} spots)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
