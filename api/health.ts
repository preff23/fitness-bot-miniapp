import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    bot_token: process.env.BOT_TOKEN ? "configured" : "missing",
    webapp_url: process.env.WEBAPP_URL || "missing"
  });
}
