// lib/firebase.ts
import * as admin from "firebase-admin";

function getDbUrl() {
  // поддерживаем оба названия переменных
  const url = process.env.FIREBASE_DB_URL || process.env.FIREBASE_DATABASE_URL;
  if (!url) throw new Error("FIREBASE_DB_URL / FIREBASE_DATABASE_URL is not set");
  return url;
}

if (!admin.apps.length) {
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || "";
  const privateKey = privateKeyRaw.includes("\\n")
    ? privateKeyRaw.replace(/\\n/g, "\n")
    : privateKeyRaw;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    } as admin.ServiceAccount),
    databaseURL: getDbUrl(),
  });
}

export const db = admin.database();
