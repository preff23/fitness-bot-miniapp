// api/telegram.ts
import { Telegraf } from "telegraf";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const WEBAPP_URL = process.env.WEBAPP_URL!;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is required");
if (!WEBAPP_URL) throw new Error("WEBAPP_URL is required");

const bot = new Telegraf(BOT_TOKEN);

// ===== handlers =====
bot.start((ctx) =>
  ctx.reply(
    "🔥 Привет! Я твой персональный фитнес-тренер!\n\n💪 Готов помочь тебе достичь идеальной формы!",
    { reply_markup: { inline_keyboard: [[{ text: "🏃‍♂️ Открыть фитнес-меню", web_app: { url: WEBAPP_URL } }]] } }
  )
);

bot.command("menu", (ctx) =>
  ctx.reply("🏋️‍♀️ Открой фитнес-меню и начни тренировки:", {
    reply_markup: { inline_keyboard: [[{ text: "🔥 Открыть приложение", web_app: { url: WEBAPP_URL } }]] },
  })
);

// Простое логирование постов канала (без сохранения)
bot.on("channel_post", (ctx) => {
  const m = ctx.channelPost;
  console.log("[channel_post]", {
    chat_id: m?.chat?.id,
    username: m?.chat?.username,
    message_id: m?.message_id,
    text: (m?.text || m?.caption || "").slice(0, 100)
  });
});

bot.on("edited_channel_post", (ctx) => {
  const m = ctx.editedChannelPost;
  console.log("[edited_channel_post]", {
    chat_id: m?.chat?.id, 
    username: m?.chat?.username,
    message_id: m?.message_id,
    text: (m?.text || m?.caption || "").slice(0, 100)
  });
});

// ===== serverless handler =====
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ ok: true, ping: true, ts: Date.now(), bot: "fitness-trainer" });
    }
    await bot.handleUpdate(req.body as any);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[webhook error]", e);
    return res.status(200).json({ ok: true });
  }
}