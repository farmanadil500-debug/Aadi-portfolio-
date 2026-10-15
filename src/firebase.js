// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoI1QAQ4vT85SVtF-eRmmQwxce4jSUjpY",
  authDomain: "farman-6fdb2.firebaseapp.com",
  projectId: "farman-6fdb2",
  storageBucket: "farman-6fdb2.firebasestorage.app",
  messagingSenderId: "45872973284",
  appId: "1:45872973284:web:8f7f4780ef5131a4f5b3f1",
  measurementId: "G-XV18HJ2S5D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);