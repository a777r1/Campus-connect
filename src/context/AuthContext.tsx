import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { isFirebaseConfigured, auth as firebaseAuth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: 'student' | 'admin') => Promise<void>;
  loginAsFacultyShortcut: () => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync auth state
  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
        if (firebaseUser) {
          const email = firebaseUser.email || '';
          const role = (email.includes('admin') || email.includes('faculty')) ? 'admin' : 'student';
          
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || email.split('@')[0],
            email: email,
            role: role,
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Sandbox: Load current session from localStorage
      const session = localStorage.getItem('cc_current_session');
      if (session) {
        setUser(JSON.parse(session));
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (isFirebaseConfigured) {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const firebaseUser = userCredential.user;
      const role = (email.includes('admin') || email.includes('faculty')) ? 'admin' : 'student';
      
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || email.split('@')[0],
        email: email,
        role: role,
        avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
      });
    } else {
      // Sandbox: Validate against users stored in localStorage
      const usersStr = localStorage.getItem('cc_registered_users') || '[]';
      const registeredUsers = JSON.parse(usersStr);
      
      const foundUser = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error("No account found with this email. Please sign up!");
      }
      
      if (foundUser.password !== password) {
        throw new Error("Incorrect password. Please try again.");
      }
      
      const activeUser: User = {
        id: `local-user-${Date.now()}`,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role || 'student',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${foundUser.name}`
      };
      
      setUser(activeUser);
      localStorage.setItem('cc_current_session', JSON.stringify(activeUser));
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'student' | 'admin' = 'student') => {
    if (isFirebaseConfigured) {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      });
      
      setUser({
        id: userCredential.user.uid,
        name: name,
        email: email,
        role: role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      });
    } else {
      // Sandbox: Store in localStorage
      const usersStr = localStorage.getItem('cc_registered_users') || '[]';
      const registeredUsers = JSON.parse(usersStr);
      
      const exists = registeredUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        throw new Error("This email is already registered. Try logging in!");
      }
      
      const newUser = { name, email, password, role };
      registeredUsers.push(newUser);
      localStorage.setItem('cc_registered_users', JSON.stringify(registeredUsers));
      
      const activeUser: User = {
        id: `local-user-${Date.now()}`,
        name: name,
        email: email,
        role: role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      };
      
      setUser(activeUser);
      localStorage.setItem('cc_current_session', JSON.stringify(activeUser));
    }
  };

  const loginAsFacultyShortcut = () => {
    const facultyUser: User = {
      id: 'local-faculty-admin',
      name: 'Dr. Jane Faculty',
      email: 'faculty@college.edu',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
    };
    setUser(facultyUser);
    if (!isFirebaseConfigured) {
      localStorage.setItem('cc_current_session', JSON.stringify(facultyUser));
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await firebaseSignOut(firebaseAuth);
    } else {
      localStorage.removeItem('cc_current_session');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup,
      loginAsFacultyShortcut,
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' || user?.role === 'faculty',
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
