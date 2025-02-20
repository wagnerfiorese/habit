import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDfORJefd6icnbTEQG_WMC0wuZLBiyhmUM",
    authDomain: "habit-ad7ec.firebaseapp.com",
    projectId: "habit-ad7ec",
    storageBucket: "habit-ad7ec.appspot.com",
    messagingSenderId: "787883758219",
    appId: "1:787883758219:web:dc752d523b3744b389fa8e",
    measurementId: "G-ECHNP9HQ50"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { database };
