import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, CategoryId } from '../types';
import { playSound } from '../utils/sound';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isGuest: boolean;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'forgot';
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  signupWithEmail: (name: string, email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  continueAsGuest: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const STORAGE_KEY_AUTH = 'promptlab_user_auth_v2';

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest_user',
  name: 'Niharika',
  email: 'guest@promptlab.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isGuest: true,
  createdAt: Date.now(),
  favoriteCategories: ['education', 'career', 'shopping'],
  bio: 'Learning prompt engineering to supercharge work and daily productivity.',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_GUEST_USER);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch (e) {
      console.warn('Failed to load user profile from storage', e);
    }
  }, []);

  const saveUser = useCallback((newUser: UserProfile) => {
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
    } catch (e) {
      console.warn('Failed to persist user profile', e);
    }
  }, []);

  const openAuthModal = useCallback((mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const loginWithEmail = async (email: string, _pass: string): Promise<boolean> => {
    const namePart = email.split('@')[0];
    const capitalizedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const loggedUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: capitalizedName || 'Niharika',
      email,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${namePart}`,
      isGuest: false,
      createdAt: Date.now(),
      favoriteCategories: ['education', 'career', 'social'],
      bio: 'PromptLab Explorer mastering AI communication.',
    };

    saveUser(loggedUser);
    playSound('success');
    closeAuthModal();
    return true;
  };

  const signupWithEmail = async (name: string, email: string, _pass: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: name.trim() || 'Niharika',
      email,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, '')}`,
      isGuest: false,
      createdAt: Date.now(),
      favoriteCategories: ['education', 'career', 'shopping'],
      bio: 'Excited to learn how to write high-impact prompts for work and studies.',
    };

    saveUser(newUser);
    playSound('badge');
    closeAuthModal();
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // 1-Click fast Google auth with Niharika's account info
    const googleUser: UserProfile = {
      id: 'google_user_niharika',
      name: 'Niharika Ravulapalli',
      email: 'niharikaravulapalli24@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isGuest: false,
      createdAt: Date.now(),
      favoriteCategories: ['education', 'career', 'shopping', 'coding'],
      bio: 'Building and practicing AI prompting on PromptLab.',
    };

    saveUser(googleUser);
    playSound('success');
    closeAuthModal();
    return true;
  };

  const continueAsGuest = useCallback(() => {
    saveUser(DEFAULT_GUEST_USER);
    closeAuthModal();
    playSound('click');
  }, [saveUser, closeAuthModal]);

  const logout = useCallback(() => {
    saveUser(DEFAULT_GUEST_USER);
    playSound('click');
  }, [saveUser]);

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      const updated = { ...user, ...updates };
      saveUser(updated);
      playSound('success');
    },
    [user, saveUser]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !user.isGuest,
        isGuest: user.isGuest,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        continueAsGuest,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
