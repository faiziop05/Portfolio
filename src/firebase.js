// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA9DRwuDGBkpFRCewhULsbBU6C5x7LyRXc",
    authDomain: "console-84296.firebaseapp.com",
    projectId: "console-84296",
    storageBucket: "console-84296.firebasestorage.app",
    messagingSenderId: "720238956517",
    appId: "1:720238956517:web:0df896b18cfd239668290c",
    measurementId: "G-76M9JQ5Q27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
