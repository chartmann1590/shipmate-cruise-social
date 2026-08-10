import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CruiseProvider, useCruise } from './context/CruiseContext';
import { SocialProvider } from './context/SocialContext';
import { ChatProvider } from './context/ChatContext';

import { Header } from './components/Navigation/Header';
import { MobileNav } from './components/Navigation/MobileNav';
import { Sidebar } from './components/Navigation/Sidebar';

import { SocialFeed } from './components/Feed/SocialFeed';
import { ItineraryView } from './components/Itinerary/ItineraryView';
import { ChatHub } from './components/Chat/ChatHub';
import { CruiseToolsView } from './components/Tools/CruiseToolsView';
import { ProfileView } from './components/Profile/ProfileView';

import { CruiseSyncModal } from './components/Modals/CruiseSyncModal';
import { NewGroupModal } from './components/Modals/NewGroupModal';
import { SharePassModal } from './components/Modals/SharePassModal';
import { AuthModal } from './components/Modals/AuthModal';
import { LegalView } from './components/Legal/LegalView';
import { OnboardingView } from './components/Onboarding/OnboardingView';
import { ErrorBoundary } from './components/System/ErrorBoundary';
import { SettingsView } from './components/Settings/SettingsView';

import { WifiOff, Download, Sparkles, X } from './components/Icons';

import './styles/index.css';
import './styles/components.css';

const MainAppContent = () => {
  const { authReady, currentUser, setIsAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState(() => new URLSearchParams(window.location.search).get('tab') || 'feed');
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isSharePassOpen, setIsSharePassOpen] = useState(false);
  const [editingSailing, setEditingSailing] = useState(null);

  const { isOfflineMode } = useCruise();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showOnboardingSync, setShowOnboardingSync] = useState(false);

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    if (['feed', 'itinerary', 'chats', 'tools', 'profile', 'settings'].includes(requestedTab)) setActiveTab(requestedTab);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!authReady) {
    return <div className="app-loading"><div className="splash-logo"><span>SM</span></div><div className="splash-wake" /><p>Charting your sailing space...</p><small>Connecting securely to ShipMate</small></div>;
  }

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setShowInstallBanner(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  const needsOnboarding = Boolean(currentUser && (!currentUser.sailings?.length || !currentUser.cruiseStartDate || !currentUser.cruiseEndDate));

  return (
    <div className="app-container">
      {/* Sidebar for Desktop */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <Header 
          onOpenSync={() => { if (!currentUser) return setIsAuthModalOpen(true); setEditingSailing(null); setIsSyncOpen(true); }}
          onOpenSharePass={() => setIsSharePassOpen(true)} 
          onOpenSettings={() => setActiveTab('settings')}
        />

        {/* Offline Sea-Day Alert Banner */}
        {isOfflineMode && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.25) 0%, rgba(225, 29, 72, 0.15) 100%)',
            borderBottom: '1px solid rgba(244, 63, 94, 0.3)',
            padding: '10px 20px',
            color: '#fb7185',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <WifiOff size={16} />
            <span>At Sea Mode: saved sailing details are available. New activity will sync when you reconnect.</span>
          </div>
        )}

        {/* PWA Install Banner */}
        {showInstallBanner && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.85rem' }}>
              <Sparkles size={16} className="text-amber-400" />
              <span>Install ShipMate PWA on your home screen for quick offline access at sea!</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleInstallPWA}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: '#0284c7',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Download size={14} />
                <span>Install PWA</span>
              </button>
              <button onClick={() => setShowInstallBanner(false)} style={{ background: 'transparent', color: '#94a3b8' }}>
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Main Route Switcher */}
        <main className="main-content">
          {activeTab === 'terms' || activeTab === 'privacy' ? <LegalView kind={activeTab} /> : null}
          {needsOnboarding ? <OnboardingView user={currentUser} onSetSailing={() => setShowOnboardingSync(true)} /> : null}
          {!needsOnboarding && !currentUser && !['feed', 'terms', 'privacy'].includes(activeTab) ? <div className="account-required"><span className="eyebrow">Private sailing space</span><h2>Join ShipMate to unlock this space</h2><p>Profiles, itineraries, group chats, calls, and sailing data are available to signed-in cruisers only.</p><button onClick={() => setIsAuthModalOpen(true)}>Sign in or create account</button></div> : null}
          {currentUser && !needsOnboarding && activeTab === 'feed' && <SocialFeed />}
          {currentUser && !needsOnboarding && activeTab === 'itinerary' && <ItineraryView />}
          {currentUser && !needsOnboarding && activeTab === 'chats' && <ChatHub />}
          {currentUser && !needsOnboarding && activeTab === 'tools' && <CruiseToolsView />}
          {currentUser && !needsOnboarding && activeTab === 'profile' && (
            <ProfileView 
              onOpenSync={(sailing) => { setEditingSailing(sailing || null); setIsSyncOpen(true); }}
              onOpenSharePass={() => setIsSharePassOpen(true)} 
              onOpenSettings={() => setActiveTab('settings')}
            />
          )}
          {currentUser && !needsOnboarding && activeTab === 'settings' && <SettingsView />}
        </main>
        <footer className="legal-footer"><a href="?tab=terms">Terms of Use</a><a href="?tab=privacy">Privacy Policy</a><span>Manage notifications and profile visibility from your account.</span></footer>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Modals */}
      <CruiseSyncModal isOpen={isSyncOpen || showOnboardingSync} initialSailing={editingSailing} onClose={() => { setIsSyncOpen(false); setShowOnboardingSync(false); setEditingSailing(null); }} />
      <NewGroupModal />
      <SharePassModal isOpen={isSharePassOpen} onClose={() => setIsSharePassOpen(false)} />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <CruiseProvider>
        <SocialProvider>
          <ChatProvider>
            <MainAppContent />
          </ChatProvider>
        </SocialProvider>
      </CruiseProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}
