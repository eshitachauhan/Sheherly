import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "sheherly-09b.firebaseapp.com",
  projectId: "sheherly-09b",
  storageBucket: "sheherly-09b.firebasestorage.app",
  messagingSenderId: "258596208797",
  appId: "1:258596208797:web:75861dba5a91605168d474"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);