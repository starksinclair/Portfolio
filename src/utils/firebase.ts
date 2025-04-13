// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import data from "./cobinedData.json";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuhTLYtMW8x9sPCezm69AFRDr-tL5FvRU",
  authDomain: "my-portfolio-website-1ca26.firebaseapp.com",
  projectId: "my-portfolio-website-1ca26",
  storageBucket: "my-portfolio-website-1ca26.firebasestorage.app",
  messagingSenderId: "134122844493",
  appId: "1:134122844493:web:6845736840dfd9b5c5c704",
  measurementId: "G-VK44ETZD31",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
console.log("Firebase initialized"), data;

export async function uploadPortfolio() {
  for (const project of data) {
    const docRef = doc(collection(db, "portfolio"), project.id);
    await setDoc(docRef, project);
  }
}
