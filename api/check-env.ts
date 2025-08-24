import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  
  const envVars = {
    BOT_TOKEN: process.env.BOT_TOKEN ? "✅ Установлен" : "❌ Отсутствует",
    WEBAPP_URL: process.env.WEBAPP_URL || "❌ Отсутствует",
    CHANNEL_ID: process.env.CHANNEL_ID || "❌ Отсутствует (будет использован CHANNEL_USERNAME)",
    CHANNEL_USERNAME: process.env.CHANNEL_USERNAME || "❌ Отсутствует",
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? "✅ Установлен" : "❌ Отсутствует",
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? "✅ Установлен" : "❌ Отсутствует",
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? "✅ Установлен" : "❌ Отсутствует",
    FIREBASE_DB_URL: process.env.FIREBASE_DB_URL || "❌ Отсутствует"
  };
  
  res.status(200).json({
    ok: true,
    env: envVars,
    timestamp: Date.now(),
    channel_id_numeric: process.env.CHANNEL_ID ? Number(process.env.CHANNEL_ID) : null
  });
}
