// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdrmt2W6HSS0jwOu718pQunbHOUwWueDw",
  authDomain: "pantry-tracker-c3a08.firebaseapp.com",
  projectId: "pantry-tracker-c3a08",
  storageBucket: "pantry-tracker-c3a08.appspot.com",
  messagingSenderId: "859749536396",
  appId: "1:859749536396:web:daefc2239d313d2812e1a9",
  measurementId: "G-C053FXZFKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}