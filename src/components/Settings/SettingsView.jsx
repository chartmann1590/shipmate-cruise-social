import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCruise } from '../../context/CruiseContext';
import { registerPushNotifications } from '../../services/notifications';

export const SettingsView = () => {
  const { currentUser } = useAuth();
  const { userProfile, updateProfilePrivacy } = useCruise();
  const [theme, setTheme] = useState(() => localStorage.getItem('shipmate_theme') || 'dark');
  const [notificationState, setNotificationState] = useState(() => typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');
  const [message, setMessage] = useState('');

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('shipmate_theme', theme); }, [theme]);

  const enableNotifications = async () => {
    const result = await registerPushNotifications(currentUser?.id);
    setNotificationState(result === 'granted' ? 'granted' : result);
    setMessage(result === 'granted' ? 'Push notifications are enabled on this device.' : 'Notifications could not be enabled in this browser.');
  };

  return <div className="settings-page">
    <div className="settings-hero"><span className="eyebrow">Your ShipMate control room</span><h1>Settings</h1><p>Make the app feel like yours, choose what you share, and control how the sailing reaches you.</p></div>
    <section className="settings-card glass-panel"><div><span className="settings-kicker">Appearance</span><h2>Choose your atmosphere</h2><p>Dark ocean is tuned for night sailing. Light deck keeps things crisp in port.</p></div><div className="segmented-control"><button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>Night sea</button><button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>Day deck</button></div></section>
    <section className="settings-card glass-panel"><div><span className="settings-kicker">Notifications</span><h2>Never miss your people</h2><p>Messages, reactions, comments, and sailing updates can reach this device even when ShipMate is closed.</p></div><button className="settings-action" onClick={enableNotifications}>{notificationState === 'granted' ? 'Notifications enabled' : 'Enable notifications'}</button>{message && <p className="settings-message" role="status">{message}</p>}</section>
    <section className="settings-card glass-panel"><div><span className="settings-kicker">Privacy</span><h2>Control your visibility</h2><p>Public profiles can be discovered by people on the same sailing. Private profiles stay limited to your connections.</p></div><select value={userProfile?.profileVisibility || 'private'} onChange={(event) => updateProfilePrivacy(event.target.value)}><option value="private">Private profile</option><option value="public">Public on my sailing</option></select></section>
  </div>;
};
