import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  
  try {
    // Проверяем переменные без импорта Firebase
    const env = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "missing",
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL || "missing",
      CHANNEL_ID: process.env.CHANNEL_ID || "missing"
    };
    
    console.log("ENV check:", env);
    
    res.status(200).json({
      ok: true,
      message: "Simple test successful",
      env: env,
      timestamp: Date.now()
    });
    
  } catch (error: any) {
    console.error("Simple test error:", error);
    res.status(200).json({
      ok: false,
      error: error.message
    });
  }
}
