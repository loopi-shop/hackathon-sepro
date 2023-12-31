// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import usersRepository from "../repositories/users.repository";

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

const authApp = getAuth(app);
const auth = {
    authApp: authApp,
    register: async (email, password, metadata) => {
        const userCredentials = await createUserWithEmailAndPassword(authApp, email, password);

        return { user: await usersRepository.createFromAuth(userCredentials.user, metadata), userCredentials };
    },
    signIn: async (email, password) => {
        const userCredentials = await signInWithEmailAndPassword(authApp, email, password);

        return { user: await usersRepository.updateLoginAt(userCredentials.user.uid), userCredentials };
    },
    signOut: async () => {
        await signOut(authApp);
    }
}

export {
    app,
    auth,
    database,
}