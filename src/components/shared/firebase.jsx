// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtVmBdfHBShkeJ7_Nmw29xYesxzBeVjl0",
  authDomain: "global-growth-consultancy.firebaseapp.com",
  projectId: "global-growth-consultancy",
  storageBucket: "global-growth-consultancy.appspot.com",
  messagingSenderId: "255591995949",
  appId: "1:255591995949:web:9bf3f8acdc56c1605436a4",
  measurementId: "G-05GBRTG4RS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
