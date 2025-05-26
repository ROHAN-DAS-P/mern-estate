// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-1f26b.firebaseapp.com",
  projectId: "mern-estate-1f26b",
  storageBucket: "mern-estate-1f26b.firebasestorage.app",
  messagingSenderId: "473334847018",
  appId: "1:473334847018:web:0c9a8cbf25dc9097fc9553"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);