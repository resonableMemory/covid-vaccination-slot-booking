import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,

  authDomain: "covid-vaccination-bookin-5601d.firebaseapp.com",

  projectId: "covid-vaccination-bookin-5601d",

  storageBucket: "covid-vaccination-bookin-5601d.appspot.com",

  messagingSenderId: "713231540462",

  appId: "1:713231540462:web:18eb228225b924c64a93ff"

};


const app = initializeApp(firebaseConfig);
export const  db=getFirestore(app)
export const auth=getAuth(app)