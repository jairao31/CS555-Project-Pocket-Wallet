// Import the functions you need from the SDKs you need

const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhCnBS7Q-YOVLT-YYqa6NbY2ZoHkS-Koc",
  authDomain: "pocket-wallet-12969.firebaseapp.com",
  databaseURL: "https://pocket-wallet-12969-default-rtdb.firebaseio.com",
  projectId: "pocket-wallet-12969",
  storageBucket: "pocket-wallet-12969.appspot.com",
  messagingSenderId: "484931660463",
  appId: "1:484931660463:web:8a2bad772c72a0f877425a",
  measurementId: "G-GPTKVVVFFE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage, app };
