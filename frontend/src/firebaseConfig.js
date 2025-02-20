import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCAjZVZnmsiKnmZGYWI_HznEDz0F94JyC8",
  authDomain: "video-call-app-libras.firebaseapp.com",
  projectId: "video-call-app-libras",
  storageBucket: "video-call-app-libras.firebasestorage.app",
  messagingSenderId: "170453629667",
  appId: "1:170453629667:web:708e56e4c948e697bce3d6",
  measurementId: "G-YZ9FCWG3Q8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

