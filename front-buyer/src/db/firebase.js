// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBS9Qrb_-TAe2sDwvtl-TpC5n8phKNQ-_w",
    authDomain: "hackathon-sepro.firebaseapp.com",
    projectId: "hackathon-sepro",
    storageBucket: "hackathon-sepro.appspot.com",
    messagingSenderId: "723411116061",
    appId: "1:723411116061:web:5202f5909619209ce626f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export {
    database,
    app,
}