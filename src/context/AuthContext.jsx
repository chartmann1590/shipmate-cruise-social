import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  configReady,
  onAuthStateChanged,
  getUserProfile,
  registerUser,
  loginUser,
  loginWithGoogle,
  signOut
} from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      setAuthError(configReady ? 'Firebase could not be initialized.' : 'Firebase configuration is missing.');
      setIsAuthModalOpen(true);
      return () => {};
    }

    return onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user ? await getUserProfile(user) : null);
        setIsAuthModalOpen(!user);
      } catch (error) {
        setAuthError(error.message);
      } finally {
        setAuthReady(true);
      }
    }, (error) => {
      setAuthError(error.message);
      setAuthReady(true);
      setIsAuthModalOpen(true);
    });
  }, []);

  const signUp = async (email, password, displayName, shipName) => {
    setAuthError('');
    try {
      const profile = await registerUser(email, password, displayName, shipName);
      setCurrentUser(profile);
      setIsAuthModalOpen(false);
      return profile;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    setAuthError('');
    try {
      const profile = await loginUser(email, password);
      setCurrentUser(profile);
      setIsAuthModalOpen(false);
      return profile;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const loginGoogle = async () => {
    setAuthError('');
    try {
      const profile = await loginWithGoogle();
      setCurrentUser(profile);
      setIsAuthModalOpen(false);
      return profile;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      authReady,
      authError,
      setAuthError,
      signUp,
      login,
      loginGoogle,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authMode,
      setAuthMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
