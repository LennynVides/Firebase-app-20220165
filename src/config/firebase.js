import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0t4YokVD3Kl3SC_EwhGvNcPXxqmlApCU",
  authDomain: "practica-firebase-202201-544b0.firebaseapp.com",
  projectId: "practica-firebase-202201-544b0",
  storageBucket: "practica-firebase-202201-544b0.appspot.com",
  messagingSenderId: "264190631316",
  appId: "1:264190631316:web:496d80e851533ff8510381"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("Valor de configuración", firebaseConfig);

// Initialize Firebase

const database = getFirestore(app);

const storage = getStorage(app);

export { database, storage };
