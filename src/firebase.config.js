// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-cNotcVBtKLlf0WXYwKXwt1uS_b7guz4",
  authDomain: "house-sale-demo.firebaseapp.com",
  projectId: "house-sale-demo",
  storageBucket: "house-sale-demo.appspot.com",
  messagingSenderId: "880929385305",
  appId: "1:880929385305:web:ce57db168a7f339a717a48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();