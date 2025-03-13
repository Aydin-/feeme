import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const savePortfolio = async (userId, portfolioData) => {
  try {
    const portfolioRef = doc(db, 'portfolios', userId);
    await setDoc(portfolioRef, { coins: portfolioData }, { merge: true });
  } catch (error) {
    console.error('Error saving portfolio:', error);
    throw error;
  }
};

export const loadPortfolio = async (userId) => {
  try {
    const portfolioRef = doc(db, 'portfolios', userId);
    const portfolioDoc = await getDoc(portfolioRef);
    return portfolioDoc.exists() ? portfolioDoc.data().coins : [];
  } catch (error) {
    console.error('Error loading portfolio:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
}; 