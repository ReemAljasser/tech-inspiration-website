// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdIqikaUi4H-Fb2KraOm8mTj0jr7hGezA",
  authDomain: "tech-inspiration-2c580.firebaseapp.com",
  projectId: "tech-inspiration-2c580",
  storageBucket: "tech-inspiration-2c580.appspot.com",
  messagingSenderId: "758463374939",
  appId: "1:758463374939:web:1bb8e0459fe076c3be417e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
