importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyBCVnp8UOCFS7H5d3XGp-V0ijpMtmbbyoc",
    authDomain: "aria-41c6d.firebaseapp.com",
    projectId: "aria-41c6d",
    storageBucket: "aria-41c6d.firebasestorage.app",
    messagingSenderId: "302500289121",
    appId: "1:302500289121:web:fa8e0ee6c9b9dc501b6820"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image
    };
});