import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Ship, X, Mail, Lock, User, Sparkles, LogIn, UserPlus } from '../Icons';
import { CRUISE_LINES } from '../../data/cruiseCatalog';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, signUp, login, loginGoogle, authError, setAuthError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [shipSearch, setShipSearch] = useState('');
  const [shipKey, setShipKey] = useState('RCCL|wonder');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const shipOptions = CRUISE_LINES.flatMap((line) => line.ships.map((ship) => ({ ...ship, lineName: line.name, lineCode: line.code }))).filter((ship) => `${ship.name} ${ship.lineName}`.toLowerCase().includes(shipSearch.toLowerCase()));
  const selectedShip = CRUISE_LINES.flatMap((line) => line.ships.map((ship) => ({ ...ship, lineName: line.name, lineCode: line.code }))).find((ship) => `${ship.lineCode}|${ship.id}` === shipKey);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (authMode === 'signup' && (!name.trim() || !acceptedTerms))) return;
    setIsSubmitting(true);
    setAuthError('');
    try {
      if (authMode === 'signup') await signUp(email, password, name.trim(), selectedShip?.name || '');
      else await login(email, password);
    } catch {
      // Firebase errors are shown below the form.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    setAuthError('');
    try { await loginGoogle(); } catch { /* provider error is rendered below */ } finally { setIsSubmitting(false); }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
            }}>
              <Ship size={22} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>
                {authMode === 'signup' ? 'Join ShipMate Network' : 'Cruiser Account Login'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Connect with active sailors worldwide</p>
            </div>
          </div>
          <button onClick={() => setIsAuthModalOpen(false)} style={{ background: 'transparent', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              background: authMode === 'login' ? '#0284c7' : 'transparent',
              color: authMode === 'login' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              background: authMode === 'signup' ? '#0284c7' : 'transparent',
              color: authMode === 'signup' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            Create Account
          </button>
        </div>

        <button type="button" className="google-auth-button" onClick={handleGoogle} disabled={isSubmitting}>
          <span className="google-mark">G</span>
          Continue with Google
        </button>
        <div className="auth-divider"><span>or use email</span></div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {authError && <div className="form-error" role="alert">{authError}</div>}
          {authMode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Full Name / Cruiser Alias</label>
              <input
                type="text"
                placeholder="e.g. Captain Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>
          )}

          {authMode === 'signup' && <label className="terms-consent"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required /><span>I agree to the <a href="?tab=terms" target="_blank" rel="noreferrer">Terms of Use</a> and <a href="?tab=privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.</span></label>}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              placeholder="sailor@cruise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
              required
            />
          </div>

          {authMode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Current or Upcoming Vessel</label>
              <input value={shipSearch} onChange={(e) => setShipSearch(e.target.value)} placeholder="Search every cruise line or ship" className="ship-search-input" />
              <select
                value={shipKey}
                onChange={(e) => setShipKey(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              >
                {shipOptions.map((ship) => <option key={`${ship.lineCode}|${ship.id}`} value={`${ship.lineCode}|${ship.id}`}>{ship.name} ({ship.lineName})</option>)}
                {!shipOptions.length && <option value="custom">No match. Add the vessel after signup from your profile.</option>}
              </select>
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: '10px',
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {authMode === 'signup' ? <UserPlus size={18} /> : <LogIn size={18} />}
            <span>{isSubmitting ? 'Connecting...' : authMode === 'signup' ? 'Create my cruiser account' : 'Sign in to ShipMate'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
