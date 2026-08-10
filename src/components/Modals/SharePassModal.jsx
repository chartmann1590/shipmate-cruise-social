import React, { useState } from 'react';
import { useCruise } from '../../context/CruiseContext';
import { Ticket, X, Copy, Check, QrCode, Share2, Ship, Award } from '../Icons';

export const SharePassModal = ({ isOpen, onClose }) => {
  const { userProfile, activeShip } = useCruise();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !userProfile) return null;

  const shareLink = `https://shipmate-cruise-social-2026.web.app/cruise/${userProfile.reservationCode || userProfile.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={20} className="text-amber-400" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Official Sea Pass & Invite</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Ticket Visual */}
        <div className="cruise-pass-ticket">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#fbbf24', fontWeight: 800, fontSize: '1.1rem' }}>
            <Ship size={20} />
            <span>{activeShip.name}</span>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
            {activeShip.currentVoyage}
          </div>

          {/* User Profile Mini Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
            <img src={userProfile.avatar} alt={userProfile.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fbbf24' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{userProfile.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>{userProfile.loyaltyTier}</div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="qr-code-box">
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <rect x="0" y="0" width="30" height="30" fill="#0f172a" />
              <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
              <rect x="10" y="10" width="10" height="10" fill="#0f172a" />

              <rect x="70" y="0" width="30" height="30" fill="#0f172a" />
              <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
              <rect x="80" y="10" width="10" height="10" fill="#0f172a" />

              <rect x="0" y="70" width="30" height="30" fill="#0f172a" />
              <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
              <rect x="10" y="80" width="10" height="10" fill="#0f172a" />

              {/* Decorative QR matrix blocks */}
              <rect x="35" y="10" width="10" height="25" fill="#0f172a" />
              <rect x="50" y="25" width="15" height="15" fill="#0f172a" />
              <rect x="10" y="40" width="20" height="10" fill="#0f172a" />
              <rect x="40" y="45" width="25" height="10" fill="#0f172a" />
              <rect x="70" y="40" width="20" height="20" fill="#0f172a" />
              <rect x="35" y="70" width="15" height="20" fill="#0f172a" />
              <rect x="60" y="75" width="25" height="15" fill="#0f172a" />
            </svg>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>
            Invite Code: <span style={{ color: '#38bdf8', letterSpacing: '0.08em' }}>{userProfile.reservationCode}</span>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleCopyLink}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            borderRadius: '12px',
            background: copied ? 'rgba(20, 184, 166, 0.25)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: copied ? '#2dd4bf' : '#fff',
            border: copied ? '1px solid #2dd4bf' : 'none',
            fontWeight: 700,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {copied ? <Check size={18} /> : <Share2 size={18} />}
          <span>{copied ? 'Pass Link Copied!' : 'Copy Shareable Cruise Link'}</span>
        </button>
      </div>
    </div>
  );
};
