import React, { useEffect, useState } from 'react';
import { useCruise } from '../../context/CruiseContext';
import { Ship, Check, RefreshCw, X, Sparkles } from '../Icons';

export const CruiseSyncModal = ({ isOpen, onClose, initialSailing }) => {
  const { cruiseLines, linkReservation } = useCruise();
  const [selectedLineCode, setSelectedLineCode] = useState('RCCL');
  const [selectedShipId, setSelectedShipId] = useState('wonder');
  const [bookingCode, setBookingCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customShipName, setCustomShipName] = useState('');

  useEffect(() => {
    setSelectedLineCode(initialSailing?.cruiseLineCode || 'RCCL');
    setSelectedShipId(initialSailing?.shipId || 'wonder');
    setBookingCode(initialSailing?.reservationCode || '');
    setStartDate(initialSailing?.startDate || '');
    setEndDate(initialSailing?.endDate || '');
    setCustomShipName(initialSailing?.shipName || '');
  }, [initialSailing, isOpen]);

  if (!isOpen) return null;

  const currentLine = cruiseLines.find(c => c.code === selectedLineCode) || cruiseLines[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || endDate < startDate) return;
    linkReservation({
      id: initialSailing?.id,
      cruiseLineCode: selectedLineCode,
      reservationCode: bookingCode.trim(),
      shipId: selectedShipId,
      shipName: selectedShipId === 'custom' ? customShipName.trim() : undefined,
      startDate,
      endDate
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ship size={20} className="text-sky-400" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Link Cruise Reservation</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
          Select your cruise line platform to sync your active reservation, ship deck plans, and loyalty tier badges:
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Cruise Line Pick */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '8px' }}>Cruise Line Platform</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {cruiseLines.map(line => (
                <button
                  key={line.id}
                  type="button"
                  onClick={() => {
                    setSelectedLineCode(line.code);
                    setSelectedShipId(line.ships[0]?.id || 'wonder');
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: selectedLineCode === line.code ? 'rgba(2, 132, 199, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedLineCode === line.code ? '2px solid #38bdf8' : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: selectedLineCode === line.code ? '#38bdf8' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{line.name}</span>
                  {selectedLineCode === line.code && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Select Ship */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Select Vessel</label>
            <select
              value={selectedShipId}
              onChange={(e) => setSelectedShipId(e.target.value)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            >
              {currentLine.ships.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.class} - {s.capacity})
                </option>
              ))}
              <option value="custom">My ship is not listed</option>
            </select>
          </div>

          {selectedShipId === 'custom' && <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Vessel Name</label>
            <input value={customShipName} onChange={(e) => setCustomShipName(e.target.value)} required placeholder="Enter the vessel name" style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem' }} />
          </div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Sailing starts</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '10px 12px', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Sailing ends</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '10px 12px', color: '#fff' }} />
            </div>
          </div>

          {/* Booking Code Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Reservation / Confirmation Code</label>
            <input
              type="text"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              placeholder="e.g. RCCL-892014"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            />
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
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={16} />
             <span>{initialSailing ? 'Update Sailing' : 'Add Sailing to My Profile'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
