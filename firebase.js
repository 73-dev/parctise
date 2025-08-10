// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD73BQMxpTAU3qFhXdJa90bom8AMasSRtA",
  authDomain: "practise-d2591.firebaseapp.com",
  projectId: "practise-d2591",
  storageBucket: "practise-d2591.firebasestorage.app",
  messagingSenderId: "330260280903",
  appId: "1:330260280903:web:7980d74dfdc98f0712a362",
  measurementId: "G-Y70ZXHF9F9"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Anonim login
signInAnonymously(auth).catch(console.error);

export { db, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp };
