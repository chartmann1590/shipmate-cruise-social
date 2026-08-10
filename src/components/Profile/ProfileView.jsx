import React from 'react';
import { useCruise } from '../../context/CruiseContext';
import { useAuth } from '../../context/AuthContext';
import { Award, Ticket, Ship, RefreshCw, LogOut, User, Plus } from '../Icons';
import { SupportCenter } from '../Support/SupportCenter';

export const ProfileView = ({ onOpenSync, onOpenSharePass, onOpenSettings }) => {
  const { activeShip, sailings, activeSailingId, setActiveSailing, updateProfilePrivacy } = useCruise();
  const { currentUser, logout, setIsAuthModalOpen } = useAuth();

  if (!currentUser) {
    return (
      <div className="glass-panel" style={{ padding: '40px 20px', textAlignment: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(2, 132, 199, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8'
        }}>
          <User size={32} />
        </div>
        <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>No Active Sailor Session</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '380px', textAlign: 'center' }}>
          Sign in or create your cruiser account to manage your profile, loyalty tier, and shareable Cruise Pass!
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          style={{
            padding: '10px 24px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)'
          }}
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Profile Header Banner */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{
          height: '150px',
          backgroundImage: `url(${currentUser.coverPhoto || '/hero_banner.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.92) 100%)' }} />
        </div>

        <div style={{ padding: '0 24px 24px 24px', marginTop: '-45px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #0284c7',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
                }}
              />
              <div>
                <h2 style={{ fontSize: '1.45rem', color: '#fff' }}>{currentUser.name}</h2>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{currentUser.handle}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={onOpenSync}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#e2e8f0',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                <RefreshCw size={14} />
                <span>Link Booking</span>
              </button>

              <button
                onClick={onOpenSharePass}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#fff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)'
                }}
              >
                <Ticket size={14} />
                <span>Pass</span>
              </button>

              <button
                onClick={logout}
                style={{
                  padding: '8px 14px',
                  borderRadius: '999px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  color: '#fb7185',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Logout</span>
              </button>
            </div>
          </div>

          <p style={{ marginTop: '16px', color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.5' }}>
            {currentUser.bio}
          </p>

          {/* Badges flex row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            {(currentUser.badges || []).map((badge, idx) => (
              <span key={idx} className="badge badge-gold">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Linked Booking Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ship size={20} className="text-sky-400" />
            <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Reservation Details</h3>
          </div>
          <span className="badge badge-teal">Verified Sailor</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cruise Line & Ship</div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginTop: '2px' }}>
              {currentUser.currentShipName} ({currentUser.loyaltyLine})
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Loyalty Tier Status</div>
            <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.95rem', marginTop: '2px' }}>
              {currentUser.loyaltyTier} ({currentUser.loyaltyPoints} Points)
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cabin & Deck</div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginTop: '2px' }}>
              {currentUser.cabinNumber}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reservation Code</div>
            <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.95rem', marginTop: '2px' }}>
              {currentUser.reservationCode}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel sailings-card" style={{ padding: '24px' }}>
        <div className="sailings-card-heading">
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>My Sailings</h3>
            <p>Keep future cruises here and switch your active ship whenever plans change.</p>
          </div>
          <button className="sailing-add-button" onClick={() => onOpenSync(null)}><Plus size={15} /> Add sailing</button>
          <button className="sailing-edit-button" onClick={onOpenSettings}>Settings</button>
        </div>

        <div className="sailing-list">
          {sailings.map((sailing) => (
            <div className={`sailing-list-item ${activeSailingId === sailing.id ? 'active' : ''}`} key={sailing.id}>
              <button className="sailing-list-main" onClick={() => setActiveSailing(sailing.id)}>
                <span className="sailing-list-kicker">{sailing.cruiseLineName}</span>
                <strong>{sailing.shipName}</strong>
                <span>{sailing.startDate} to {sailing.endDate}</span>
              </button>
              <button className="sailing-edit-button" onClick={() => onOpenSync(sailing)}>Edit</button>
            </div>
          ))}
          {!sailings.length && <div className="empty-state"><strong>No sailings saved</strong><span>Add a future cruise to personalize your feed, schedule, and shipmate conversations.</span></div>}
        </div>
      </div>

      <div className="glass-panel privacy-card" style={{ padding: '24px' }}>
        <div><h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Profile privacy</h3><p>Choose whether other cruisers can discover your profile.</p></div>
        <select className="privacy-select" aria-label="Profile visibility" value={currentUser.profileVisibility || 'private'} onChange={(event) => updateProfilePrivacy(event.target.value)}><option value="private">Private: only people I connect with</option><option value="public">Public: discoverable on my sailing</option></select>
      </div>
      <SupportCenter />
    </div>
  );
};
