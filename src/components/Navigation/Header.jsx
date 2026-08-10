import React from 'react';
import { useCruise } from '../../context/CruiseContext';
import { useAuth } from '../../context/AuthContext';
import { Ship, Wifi, WifiOff, RefreshCw, Ticket, MapPin, User, LogIn, Award } from '../Icons';
import { notifyShipmate, registerPushNotifications } from '../../services/notifications';
import { subscribeToNotifications } from '../../services/firebase';

export const Header = ({ onOpenSync, onOpenSharePass }) => {
  const { isOfflineMode, toggleOfflineMode, currentDeckLocation } = useCruise();
  const { currentUser, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(() => typeof Notification !== 'undefined' && Notification.permission === 'granted');
  const [unreadNotifications, setUnreadNotifications] = React.useState(0);

  React.useEffect(() => {
    if (!currentUser?.id) return () => {};
    let previousCount = 0;
    return subscribeToNotifications(currentUser.id, (items) => {
      setUnreadNotifications(items.length);
      if (items.length > previousCount && items[0]) notifyShipmate('ShipMate update', items[0].text, items[0].url).catch(() => {});
      previousCount = items.length;
    }, () => {});
  }, [currentUser?.id]);

  const enableNotifications = async () => {
    const result = await registerPushNotifications(currentUser?.id, (payload) => {
      const title = payload.notification?.title || 'ShipMate';
      const body = payload.notification?.body || 'You have a new shipmate update.';
      navigator.serviceWorker.ready.then((registration) => registration.showNotification(title, { body, icon: '/favicon.svg' }));
    });
    setNotificationsEnabled(result === 'granted');
  };

  return (
    <header className="app-header">
      <a href="#" className="brand-logo">
        <svg viewBox="0 0 512 512" fill="none">
          <rect width="512" height="512" rx="128" fill="url(#hdr-grad)"/>
          <path d="M120 340C180 370 332 370 392 340C410 331 432 344 424 364C400 420 320 448 256 448C192 448 112 420 88 364C80 344 102 331 120 340Z" fill="#38bdf8"/>
          <path d="M70 270L160 160H352L442 270H70Z" fill="#ffffff"/>
          <path d="M256 160V290M200 220H312" stroke="#0284c7" strokeWidth="24" strokeLinecap="round"/>
          <defs>
            <linearGradient id="hdr-grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0369a1"/>
              <stop offset="1" stopColor="#0f172a"/>
            </linearGradient>
          </defs>
        </svg>
        <span>Ship<span className="brand-glow">Mate</span></span>
      </a>

      <div className="header-actions">
        {/* Sync Reservation button */}
        <button 
          onClick={onOpenSync}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '999px',
            background: 'rgba(2, 132, 199, 0.2)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <RefreshCw size={14} />
          <span>Sync Cruise</span>
        </button>

        {/* Share Cruise Pass */}
        <button 
          onClick={onOpenSharePass}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))',
            color: '#fcd34d',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <Ticket size={14} />
          <span>Pass</span>
        </button>

        {/* Auth User Pill */}
        {currentUser ? (
          <button
            onClick={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 4px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#0284c7',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
        )}

        {/* Offline Toggle button for PWA sea testing */}
        <button className="notification-toggle" onClick={enableNotifications} title="Enable message notifications">
          <span>{notificationsEnabled ? `Alerts on${unreadNotifications ? ` (${unreadNotifications})` : ''}` : 'Enable alerts'}</span>
        </button>
        <button 
          onClick={toggleOfflineMode}
          className={`offline-toggle-btn ${isOfflineMode ? 'offline' : 'online'}`}
          title={isOfflineMode ? "At Sea - Offline PWA Mode active" : "In Port - Online Mode active"}
        >
          {isOfflineMode ? <WifiOff size={14} /> : <Wifi size={14} />}
          <span>{isOfflineMode ? 'At Sea' : 'Online'}</span>
        </button>
      </div>
    </header>
  );
};
