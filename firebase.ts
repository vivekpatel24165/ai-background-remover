import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6ndquyuSAelawC5EcRG_h_sZTwQXTkiE",
  authDomain: "background-remover-2038d.firebaseapp.com",
  projectId: "background-remover-2038d",
  storageBucket: "background-remover-2038d.firebasestorage.app",
  messagingSenderId: "993342340688",
  appId: "1:993342340688:web:f06bcbe9085173d79b1b55",
  measurementId: "G-R29LTDW3TT"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();