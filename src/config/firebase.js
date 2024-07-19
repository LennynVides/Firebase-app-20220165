import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

// Configuración de Firebase
const firebaseConfig = {
  apiKey:'AIzaSyB0t4YokVD3Kl3SC_EwhGvNcPXxqmlApCU',
  authDomain:'practica-firebase-202201-544b0.firebaseapp.com',
  projectId:'practica-firebase-202201-544b0',
  storageBucket:'practica-firebase-202201-544b0.appspot.com',
  messagingSenderId:'264190631316',
  appId:'1:264190631316:web:496d80e851533ff8510381'
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializa la instancia de autenticación
const googleProvider = new GoogleAuthProvider(app);// Proveedor de autenticación de Google

export { app, auth, googleProvider };

console.log("Valor de configuracion", firebaseConfig);

// Initialize Firebase

if (app) {
  console.log('Firebase initialized successfully');
} else {
  console.log('Firebase initialization failed');
}

const database = getFirestore(app);
if (database) {
  console.log('Firestore initialized correctly');
} else {
  console.log('Firestore initialization failed');
}

const storage = getStorage(app);

if (storage) {
  console.log('storage initialized correctly');
} else {
  console.log('storage initialization failed');
}

export { database,storage };