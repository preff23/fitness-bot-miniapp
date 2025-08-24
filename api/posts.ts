// api/posts.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../lib/firebase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const limit = Math.min(parseInt(String(req.query.limit || "20"), 10), 50);
    const snap = await db.ref("/posts").orderByChild("date").limitToLast(limit).get();
    const list: any[] = [];
    if (snap.exists()) snap.forEach((c) => list.push(c.val()));
    list.sort((a, b) => b.date - a.date);
    res.status(200).json({ ok: true, items: list });
  } catch (e: any) {
    console.error("[posts error]", e);
    res.status(200).json({ ok: false, error: e.message || "unknown" });
  }
}
