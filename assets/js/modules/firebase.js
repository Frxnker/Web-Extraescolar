// ── FIREBASE CONFIGURATION ──
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, where, updateDoc, setDoc, onSnapshot, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKxDgy8II5sPJGhOcxif3aVx-BS8_KMK0",
  authDomain: "web-extraescolar.firebaseapp.com",
  projectId: "web-extraescolar",
  storageBucket: "web-extraescolar.firebasestorage.app",
  messagingSenderId: "1014112255641",
  appId: "1:1014112255641:web:1f454b5101b9757ed40208",
  measurementId: "G-MW6EE7J6ZB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, where, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, updateDoc, setDoc, onSnapshot, limit };
