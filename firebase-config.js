// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7PYzkH8pm2EXCCn6EEW38_25vZ5IyBLc",
  authDomain: "omkar-antiques-store.firebaseapp.com",
  projectId: "omkar-antiques-store",
  storageBucket: "omkar-antiques-store.firebasestorage.app",
  messagingSenderId: "653253748520",
  appId: "1:653253748520:web:3932a240494ed410e9921d",
  measurementId: "G-T7ZK83EHK3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);