// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-e145a.firebaseapp.com",
  projectId: "estate-e145a",
  storageBucket: "estate-e145a.appspot.com",
  messagingSenderId: "321227284268",
  appId: "1:321227284268:web:5913dbaa4c8a11b6441689",
  measurementId: "G-D48X38XE90"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
