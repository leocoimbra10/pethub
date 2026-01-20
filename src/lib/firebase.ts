// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

// Initialize Firebase
let app;
if (!getApps().length) {  
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const firestore = getFirestore(app);

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
