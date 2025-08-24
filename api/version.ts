// api/version.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    ok: true,
    ts: Date.now(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
    branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    deployment_url: process.env.VERCEL_URL || null
  });
}
