// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTmDBMVYXWzVlT8x7H0QVI1O5aqsSeMv8",
  authDomain: "ema-portal-e45d9.firebaseapp.com",
  projectId: "ema-portal-e45d9",
  storageBucket: "ema-portal-e45d9.firebasestorage.app",
  messagingSenderId: "730589784485",
  appId: "1:730589784485:web:618c412ecc02e23d0e204c",
  measurementId: "G-P7M5MFL4VN"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);