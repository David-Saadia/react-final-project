"use client";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDdbtpeMU9mWLhbs0zxLDAFSj_5ig1oAkM",
    authDomain: "testingdb-48615.firebaseapp.com",
    projectId: "testingdb-48615",
    storageBucket: "testingdb-48615.firebasestorage.app",
    messagingSenderId: "680854796084",
    appId: "1:680854796084:web:09237f61656dbb3ac29761",
    measurementId: "G-CB1267ZV1Z"
  };
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);
export {auth}
export default database;