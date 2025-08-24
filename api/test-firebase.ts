// api/test-firebase.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../lib/firebase";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const t = Date.now();
    const ref = db.ref("/healthcheck");
    await ref.set({ ts: t });
    const snap = await ref.get();
    const val = snap.val();
    res.status(200).json({
      ok: true,
      wrote: t,
      read: val,
      dbURL: process.env.FIREBASE_DB_URL || process.env.FIREBASE_DATABASE_URL
    });
  } catch (e: any) {
    res.status(200).json({ ok: false, error: e.message || String(e) });
  }
}
