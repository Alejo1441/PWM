// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAswREdMMSnclLs-1_cNYJCW8bzqMDtu4w',
  authDomain: 'autohub-1d277.firebaseapp.com',
  projectId: 'autohub-1d277',
  storageBucket: 'autohub-1d277.firebasestorage.app',
  messagingSenderId: '1086866033268',
  appId: '1:1086866033268:web:034acae7fd0e6ce9c49f21',
  measurementId: 'G-JR78YYE60Z',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
