// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2tlvlYQ9SoMCo1T2GqirucgNtpo3FySU",
  authDomain: "programming-85166.firebaseapp.com",
  projectId: "programming-85166",
  storageBucket: "programming-85166.firebasestorage.app",
  messagingSenderId: "180890466180",
  appId: "1:180890466180:web:19997ac16dda332b2a0fd1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);