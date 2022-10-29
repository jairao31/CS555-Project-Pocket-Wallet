// Import the functions you need from the SDKs you need

const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIAbck_qGrnqRv9X_obL-Qx9NMjUma2Hc",
  authDomain: "temp-ac2ca.firebaseapp.com",
  databaseURL: "https://temp-ac2ca-default-rtdb.firebaseio.com",
  projectId: "temp-ac2ca",
  storageBucket: "temp-ac2ca.appspot.com",
  messagingSenderId: "354153288696",
  appId: "1:354153288696:web:a35ab02a54371aaf6cfc0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage, app };
