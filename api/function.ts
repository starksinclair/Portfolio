import { VercelRequest, VercelResponse } from "@vercel/node";
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import ss from "../src/my-portfolio-website-1ca26-e4c33685f75e.json";
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID,
// };

if (!getApps().length) {
  initializeApp({
    credential: cert(ss as object),
  });
}
const db = getFirestore();

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    // const querySnapshot = await getDocs(collection(db, "portfolio"));
    // const data = querySnapshot.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));
    const snapshot = await db.collection("portfolio").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched data from Firebase:", data);
    res.send(data);
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
