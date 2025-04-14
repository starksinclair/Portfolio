// import { VercelRequest, VercelResponse } from "@vercel/node";
// // import data from "../src/utils/cobinedData.json" assert { type: "json" };
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// // import { initializeApp, cert, getApps } from "firebase-admin/app";
// // import { getFirestore } from "firebase-admin/firestore";
// // import service from "../src/my-portfolio-website-1ca26-e4c33685f75e.json" assert { type: "json" };

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID,
// };
// // const pp =
// //   "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8s5M+fbibo1Pc\n2kD/qS/YM1zhSo/eSkc9HG06QchyY4zU+YVbeblSsfEETh9jFkNmf5ZcC6ePQwO/\nL5kMs6KhnWk74terf8egWvmasDSh5htztJQ9UQF+M2sw+vxuF9uhResf4ZHHGqla\nbip6v+WJLOj8DHGl4YuN55GnhI7sIHuX7/X/UpozvAd8vxcPm2QF/aECiSSC3DtN\nb6AeS/zOuTp8AZvWxlXZLKA9bULG+ye0ohliFRKsK4vDyVVP+efb38BtsIh0dylh\n9l3g5V6dzba0N+OE+aZsVstro7rw4TtJQbaAgD0LsnQyECmG9zMLJat65FEZBvjd\nBzJINPN9AgMBAAECggEABhiiFOaAYIzUAIJPj8LiQBCWu1OKltKc/xEsSTHHXUSw\nj8/Y2lXyIgUMJYi1lGCrgEP2clZRDTyLwjEyN1oVUrXQaMYhFBIOe7R8tF3lcWaK\n8/+9O0bi7rYQDDbLkW31Yz4sRK0npcBLgNemySzqaDZad4waXtLMzKKSzs/mQyQS\nTJt4XsXDtBOaT25697l4iKtw6qbx6f8MZwp5lyX3sLfpXBoz9dWc3TtXTnxL8tIX\nC1sT0OfZO44ZFIqYYSIwNdqHdiDe1MWvFl/jnlqTCVDIPZXtHoOzd5E+1RBV45qc\nSwQQEAN8HsDVAbX6pZ5Xjqri/qWaWjsPWPRDFio2WQKBgQDjHfQYzjarqqlILWMu\nHqxemuFG84xjwc914VrlYAARN7xjbF+6piPb6pX58RByKkmgFQ2qoag5MMZAgPSY\n/H9jlFgkLgzAmNxSPSs1TPcrRmAk8JpqEtR7uDJQMqwrZ1VLATE/qXuDdTab4amN\nevyLM15uBNOhpy9D4cuPSf6U5QKBgQDUsvYIY2wZW3uXX/MASFR3By4tAfnQFjTV\n2vjAtqwQgXu6MRZHmPj26bJspPpuW3T/6Byt3ppbJB42PF8JrowJnAxVSOEtragY\n4d8zT0J1flKwpI0JL8lWMwsxVqFquh92kZiSKB05PdyDN6VZgN8oP/NK8FM/SgNJ\nP1p21sJSuQKBgQDPJwL9nRlAeujsbHmKF3Ag2iOgE4R5eM1BN8swa9+j1LJ//NlT\n5TXP4Kfq0XWuq+N7n7hXahuGDnbFXtm6sJOAwE2kslvvT32lhSVj+E95qTcIemxd\nU897CQbbH1zqOdYSE4RYDL4bqU2l4K5F3Wd7j98RelWNnG//+nMwvsz2AQKBgBIC\nWRyatnNrMIq/oAadGTG+1OUQrsM0riKRWNCQZv86x2wbbeSACkx1uxrB2UZwzfZB\nA/SgzXb8FubGs9FRCyBhKxYpho9kjcAVl91zT5A9Mukr9Zkah7SZu8/gougzfCiA\n6WcuqFLJbxtZIdHzPHHfAE2PDa1lKeQQzisTwf5ZAoGBAIi1GvrPzhqmQ96u2Mkw\njL3tptN/RFLUtkRUUI46SC86v+HPlVr7IUHYD2JT3tsa4wsd0CzV5HWPE9jifsp2\nP9lpRT9gj2jNPbtLLI5S6E8DKYP9Dp2a+PxSoo9vzzPgwe+QZk6qDcPgGwcT8hzc\nqQ/nOmqfCez7WMNtA7TBcvUf\n-----END PRIVATE KEY-----\n";
// // if (!getApps().length) {
// //   initializeApp({
// //     credential: cert(service as object),
// //   });
// // }
// // const db = getFirestore();

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export default async function handler(
//   _req: VercelRequest,
//   res: VercelResponse
// ) {
//   try {
//     const querySnapshot = await getDocs(collection(db, "portfolio"));
//     const data = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     // const snapshot = await db.collection("portfolio").get();
//     // const data = snapshot.docs.map((doc) => ({
//     //   id: doc.id,
//     //   ...doc.data(),
//     // }));
//     console.log("Fetched data from Firebase:");
//     res.send(data);
//   } catch (error) {
//     console.error("Error fetching data from Firebase:", error);
//     res.status(500).json({ error: error });
//   }
// }
import { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_CONFIG || "{}"
    );
    initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    initializeApp(firebaseConfig);
    console.error("Error initializing Firebase with service account:", error);
  }
}

const db = getFirestore();

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    const snapshot = await db.collection("portfolio").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched data from Firebase:", data);
    res.send(data);
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    res.status(500).json({ error: error });
  }
}
