import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBviXHpjYTHySZeDCV9yOBTxTXaxoUCY04",
  authDomain: "tr4velapp-5cbac.firebaseapp.com",
  projectId: "tr4velapp-5cbac",
  storageBucket: "tr4velapp-5cbac.firebasestorage.app",
  messagingSenderId: "898865731648",
  appId: "1:898865731648:web:ca5ed068a79d7e82eb27a5",
  measurementId: "G-7CPLMKJS4R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { auth, db, storage };

