// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALO5Rtn52IDnAuyW9Elo0ZPSeCtty8hLo",
  authDomain: "baggage-cost.firebaseapp.com",
  projectId: "baggage-cost",
  storageBucket: "baggage-cost.appspot.com",
  messagingSenderId: "175279592974",
  appId: "1:175279592974:web:04836fbec69423deb58e5f",
  measurementId: "G-Y7TRY0CSK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
