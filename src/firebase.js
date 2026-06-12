import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBCVnp8UOCFS7H5d3XGp-V0ijpMtmbbyoc",
    authDomain: "aria-41c6d.firebaseapp.com",
    projectId: "aria-41c6d",
    storageBucket: "aria-41c6d.firebasestorage.app",
    messagingSenderId: "302500289121",
    appId: "1:302500289121:web:fa8e0ee6c9b9dc501b6820"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
