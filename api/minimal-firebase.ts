// api/minimal-firebase.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  
  try {
    // Проверяем ENV переменные
    const env = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "MISSING",
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || "MISSING", 
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? "SET" : "MISSING",
      FIREBASE_DB_URL: process.env.FIREBASE_DB_URL || "MISSING",
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL || "MISSING"
    };
    
    // Пробуем импортировать firebase-admin
    console.log("🔄 Importing firebase-admin...");
    const admin = await import("firebase-admin");
    console.log("✅ firebase-admin imported");
    
    // Пробуем инициализировать (без подключения к БД)
    if (!admin.default.apps.length) {
      console.log("🔄 Initializing Firebase...");
      
      const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || "";
      const privateKey = privateKeyRaw.includes("\\n") 
        ? privateKeyRaw.replace(/\\n/g, "\n") 
        : privateKeyRaw;
        
      const dbUrl = process.env.FIREBASE_DB_URL || process.env.FIREBASE_DATABASE_URL || "";
      
      admin.default.initializeApp({
        credential: admin.default.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        } as admin.ServiceAccount),
        databaseURL: dbUrl,
      });
      console.log("✅ Firebase initialized");
    }
    
    res.status(200).json({
      ok: true,
      message: "Firebase initialized successfully",
      env,
      apps: admin.default.apps.length
    });
    
  } catch (error: any) {
    console.error("❌ Firebase error:", error);
    res.status(200).json({
      ok: false,
      error: error.message,
      stack: error.stack?.slice(0, 500) // первые 500 символов стека
    });
  }
}
