// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdJxCEMQILPHWJLDmPpZhj_SaEAljE3Kw",
  authDomain: "bim-dev-master-1bd5c.firebaseapp.com",
  projectId: "bim-dev-master-1bd5c",
  storageBucket: "bim-dev-master-1bd5c.firebasestorage.app",
  messagingSenderId: "842351689708",
  appId: "1:842351689708:web:2a1fa041bf6b5bbda08ac9",
  measurementId: "G-ZEQ2JW5EM5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebaseDB = getFirestore();