// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserData {
  smsNotifications: boolean;
  emailNotifications: boolean;
  projects(field: string, operator: string, value: string | number | boolean): import("@firebase/firestore").QueryConstraint;
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  role: 'admin' | 'supervisor' | 'stakeholder';
  displayName?: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'admin' | 'supervisor' | 'stakeholder', displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyPhoneNumber: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<string>;
  confirmCode: (verificationId: string, code: string) => Promise<void>;
  setUpRecaptcha: (elementId: string) => RecaptchaVerifier;
  refreshUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get additional user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData({ uid: user.uid, ...userDoc.data() } as UserData);
        } else {
          console.log('No user data found in Firestore');
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, role: 'admin' | 'supervisor' | 'stakeholder', displayName?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      role,
      displayName: displayName || email.split('@')[0],
      createdAt: new Date()
    });
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const setUpRecaptcha = (elementId: string) => {
    return new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {}
    });
  };

  const verifyPhoneNumber = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
    const phoneProvider = new PhoneAuthProvider(auth);
    return phoneProvider.verifyPhoneNumber(phoneNumber, appVerifier);
  };

  const confirmCode = async (verificationId: string, code: string) => {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    await signInWithCredential(auth, credential);
  };

  const refreshUserData = async () => {
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserData({ uid: currentUser.uid, ...userDoc.data() } as UserData);
      } else {
        console.log('No user data found in Firestore');
        setUserData(null);
      }
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    verifyPhoneNumber,
    confirmCode,
    setUpRecaptcha,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};