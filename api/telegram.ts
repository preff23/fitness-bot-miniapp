// api/telegram.ts
import { Telegraf } from "telegraf";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../lib/firebase";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const WEBAPP_URL = process.env.WEBAPP_URL!;
const WANT_ID = process.env.CHANNEL_ID ? Number(process.env.CHANNEL_ID) : 0;
const WANT_UNAME = (process.env.CHANNEL_USERNAME || "").toLowerCase();

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is required");
if (!WEBAPP_URL) throw new Error("WEBAPP_URL is required");

const bot = new Telegraf(BOT_TOKEN);

// ===== сервисные хелперы =====
function fromWantedChannel(m: any) {
  const chatId = m?.chat?.id; // number
  const chatUname = ("@" + (m?.chat?.username || "")).toLowerCase();
  return (WANT_ID && chatId === WANT_ID) || (!!WANT_UNAME && chatUname === WANT_UNAME);
}

async function savePost(ctx: any) {
  try {
    const m = ctx.channelPost || ctx.editedChannelPost;
    if (!m) return;
    console.log("[update] channel:", m.chat?.id, "@"+(m.chat?.username||""), "msg:", m.message_id, "edited:", !!ctx.editedChannelPost, "mg:", m.media_group_id, "hasPhoto:", !!m.photo);

    if (!fromWantedChannel(m)) {
      console.log("[skip] not target channel");
      return;
    }

    const payload = {
      id: String(m.message_id),
      chat_id: m.chat.id,
      chat_username: m.chat.username || null,
      date: m.date,
      text: m.text || m.caption || "",
      entities: m.entities || m.caption_entities || [],
      photos: (m.photo || []).map((p: any) => p.file_id),
      media_group_id: m.media_group_id || null,
      edited: Boolean(ctx.editedChannelPost),
      has_media: Boolean(m.photo && m.photo.length),
    };

    await db.ref(`/posts/${payload.id}`).set(payload);
    console.log("[saved]", payload.id, (payload.text || "").slice(0, 80));
  } catch (e) {
    console.error("[savePost error]", e);
  }
}

// ===== handlers =====
bot.start((ctx) =>
  ctx.reply(
    "Привет! Я персональный тренер.\nОткрой меню:",
    { reply_markup: { inline_keyboard: [[{ text: "Открыть фитнес-меню", web_app: { url: WEBAPP_URL } }]] } }
  )
);
bot.command("menu", (ctx) =>
  ctx.reply("Открой фитнес-меню:", {
    reply_markup: { inline_keyboard: [[{ text: "Открыть", web_app: { url: WEBAPP_URL } }]] },
  })
);

// Получение постов канала
bot.on("channel_post", savePost);
bot.on("edited_channel_post", savePost);

// ===== serverless handler =====
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store"); // избегаем кэша
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ ok: true, ping: true, ts: Date.now() });
    }
    await bot.handleUpdate(req.body as any);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[webhook error]", e);
    return res.status(200).json({ ok: true });
  }
}
