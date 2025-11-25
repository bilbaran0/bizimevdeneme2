import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxNRP3KR_q2HwpSJy5mIazybJOHG_9t3k",
  authDomain: "evapp-e96f5.firebaseapp.com",
  projectId: "evapp-e96f5",
  storageBucket: "evapp-e96f5.firebasestorage.app",
  messagingSenderId: "676677236184",
  appId: "1:676677236184:web:b271a70bcd79752541eead",
  measurementId: "G-0VEMBJX3HY"
};

// Initialize Firebase
const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const isConfigured = true;

export { db, isConfigured };