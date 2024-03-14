// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNKCMLQiuKP1VHxN1ZJ0t_4rqDpcMq2qw",
  authDomain: "agency-portal-client.firebaseapp.com",
  projectId: "agency-portal-client",
  storageBucket: "agency-portal-client.appspot.com",
  messagingSenderId: "172159041529",
  appId: "1:172159041529:web:ad8fd4818295ab27864728",
  measurementId: "G-FBD0J8WDJ4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
