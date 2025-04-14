import { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_CONFIG) {
        try {
          const serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT_CONFIG
          );
          initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        } catch (error) {
          console.error(
            "Error parsing FIREBASE_SERVICE_ACCOUNT_CONFIG:",
            error
          );
          throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_CONFIG");
        }
      } else {
        initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      }
    } catch (error) {
      console.error("Firebase Admin Initialization Error:", error);
    }
  }
};

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    initializeFirebaseAdmin();
    const db = getFirestore();
    const snapshot = await db.collection("portfolio").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    res.status(500).json({ error: error });
  }
}
