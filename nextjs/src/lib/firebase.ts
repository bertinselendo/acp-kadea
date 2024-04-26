// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7Y7-fcHV9QLCoBRf0GyNvf1QO6dro5vw",
  authDomain: "acp-kadea.firebaseapp.com",
  projectId: "acp-kadea",
  storageBucket: "acp-kadea.appspot.com",
  messagingSenderId: "806377433445",
  appId: "1:806377433445:web:4b65590ed318f56c21998c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
