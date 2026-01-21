'use client';

// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, User, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcdD9I6ea20Y69Yj5ffn8R3ctlLXSY1uo",
  authDomain: "studio-1786811890-24060.firebaseapp.com",
  projectId: "studio-1786811890-24060",
  storageBucket: "studio-1786811890-24060.firebasestorage.app",
  messagingSenderId: "182469140897",
  appId: "1:182469140897:web:422316ce2238c00fa8ebe0"
};

// Initialize Firebase
let app;
if (!getApps().length) {  
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const firestore = getFirestore(app);

// Set persistence
setPersistence(auth, browserLocalPersistence);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

export { auth, firestore };
