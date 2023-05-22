// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZ4IdPIdMp7cQHiK6RU2l-LwZrEhfGNm8",
  authDomain: "aparcaqui.firebaseapp.com",
  databaseURL: "https://aparcaqui-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "aparcaqui",
  storageBucket: "aparcaqui.appspot.com",
  messagingSenderId: "1003841412868",
  appId: "1:1003841412868:web:7836f0cff9f860980cfa51",
  measurementId: "G-7R315P5SJ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;





