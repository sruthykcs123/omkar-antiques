
// Import from Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyA7PYzkH8pm2EXCCn6EEW38_25vZ5IyBLc",
  authDomain: "omkar-antiques-store.firebaseapp.com",
  projectId: "omkar-antiques-store",
  storageBucket: "omkar-antiques-store.appspot.com",   // ✅ fixed
  messagingSenderId: "653253748520",
  appId: "1:653253748520:web:3932a240494ed410e9921d",
  measurementId: "G-T7ZK83EHK3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);   // ✅ Firestore
const auth = getAuth(app);      // ✅ Auth
const analytics = getAnalytics(app);

export { db, auth };

