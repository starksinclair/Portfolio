import { VercelResponse } from "@vercel/node";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

export default async function handler(res: VercelResponse) {
  try {
    // const querySnapshot = await db.collection("portfolio").get();
    // const data = querySnapshot.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));
    console.log("Fetched data from Firebase:");
    res.status(200).send("Fetched data from Firebase successfully");
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
