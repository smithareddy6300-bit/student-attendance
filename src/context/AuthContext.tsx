import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types/attendance';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: Role) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  availableUsers: User[];
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'sat_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored user', e);
    }
    // Default to Prof. Sarah Jenkins (faculty) initially so users can explore immediately, but can log out or switch anytime
    return INITIAL_USERS[0];
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save auth state', e);
    }
  }, [currentUser]);

  const login = (emailOrRoll: string, role?: Role): boolean => {
    const input = emailOrRoll.trim().toLowerCase();

    // Check by email or roll number in INITIAL_USERS
    const foundUser = INITIAL_USERS.find(
      (u) =>
        u.email.toLowerCase() === input ||
        (u.rollNumber && u.rollNumber.toLowerCase() === input) ||
        // Aliases
        (input === 'student' && u.role === 'student') ||
        (input === 'teacher' && u.role === 'teacher') ||
        (input === 'admin' && u.role === 'admin') ||
        (input === 'emma.w@student.edu' && u.id === 'u-student-1') ||
        (input === 'sarah.jenkins@university.edu' && u.id === 'u-faculty-1')
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setIsLoginModalOpen(false);
      return true;
    }

    // If custom email/roll provided
    const isStudent = role === 'student' || input.startsWith('cs') || input.includes('student');
    const defaultRole = role || (isStudent ? 'student' : 'teacher');
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: emailOrRoll.includes('@')
        ? emailOrRoll.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : `Student ${emailOrRoll.toUpperCase()}`,
      email: emailOrRoll.includes('@') ? emailOrRoll.trim() : `${input}@school.edu`,
      role: defaultRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      department: 'Computer Science',
      ...(defaultRole === 'student'
        ? {
            rollNumber: emailOrRoll.toUpperCase().startsWith('CS') ? emailOrRoll.toUpperCase() : `CS2026-${Math.floor(100 + Math.random() * 899)}`,
            enrolledCourses: ['c-cs101', 'c-cs204', 'c-mth201'],
          }
        : { teachingCourses: ['c-cs101'] }),
    };

    setCurrentUser(newUser);
    setIsLoginModalOpen(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  const switchUser = (userId: string) => {
    const target = INITIAL_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsLoginModalOpen(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchUser,
        availableUsers: INITIAL_USERS,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
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
