import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  
  try {
    console.log("🔧 Testing Firebase connection...");
    
    // Проверяем переменные окружения
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const databaseUrl = process.env.FIREBASE_DATABASE_URL;
    
    console.log("📋 Environment variables:");
    console.log("FIREBASE_PROJECT_ID:", projectId ? "✅ Set" : "❌ Missing");
    console.log("FIREBASE_CLIENT_EMAIL:", clientEmail ? "✅ Set" : "❌ Missing");
    console.log("FIREBASE_PRIVATE_KEY:", privateKey ? "✅ Set" : "❌ Missing");
    console.log("FIREBASE_DATABASE_URL:", databaseUrl ? "✅ Set" : "❌ Missing");
    
    if (!projectId || !clientEmail || !privateKey) {
      return res.status(200).json({
        ok: false,
        error: "Missing Firebase environment variables",
        missing: {
          projectId: !projectId,
          clientEmail: !clientEmail,
          privateKey: !privateKey,
          databaseUrl: !databaseUrl
        }
      });
    }
    
    // Пробуем импортировать и инициализировать Firebase
    const { db } = await import("../lib/firebase");
    console.log("✅ Firebase imported successfully");
    
    // Простой тест подключения
    const testRef = db.ref("/test");
    await testRef.set({
      timestamp: Date.now(),
      message: "Firebase connection test"
    });
    
    console.log("✅ Firebase write test successful");
    
    // Удаляем тестовые данные
    await testRef.remove();
    
    res.status(200).json({
      ok: true,
      message: "Firebase connection successful!",
      projectId: projectId,
      clientEmail: clientEmail,
      databaseUrl: databaseUrl || `https://${projectId}-default-rtdb.europe-west1.firebasedatabase.app`
    });
    
  } catch (error: any) {
    console.error("❌ Firebase error:", error);
    res.status(200).json({
      ok: false,
      error: error.message,
      stack: error.stack
    });
  }
}
