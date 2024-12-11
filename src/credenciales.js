// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMMq-djLLjw_IZmb60Oc8-z0V5a8BGUDg",
  authDomain: "gallery-c7a0f.firebaseapp.com",
  databaseURL: "https://gallery-c7a0f-default-rtdb.firebaseio.com",
  projectId: "gallery-c7a0f",
  storageBucket: "gallery-c7a0f.firebasestorage.app",
  messagingSenderId: "83560834753",
  appId: "1:83560834753:web:e234e83258a1413c5a5640"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;