import { Telegraf } from "telegraf";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const WEBAPP_URL = process.env.WEBAPP_URL!;
const SECRET = process.env.TG_WEBHOOK_SECRET; // опционально

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is required");
if (!WEBAPP_URL) throw new Error("WEBAPP_URL is required");

const bot = new Telegraf(BOT_TOKEN);

// === handlers ===
bot.start((ctx) => ctx.reply(
  "Привет! Я персональный тренер.\nОткрой фитнес-меню:",
  {
    reply_markup: {
      inline_keyboard: [[{ text: "Открыть фитнес-меню", web_app: { url: WEBAPP_URL } }]],
    },
  }
));

bot.command("menu", (ctx) => ctx.reply("Открой фитнес-меню:", {
  reply_markup: { inline_keyboard: [[{ text: "Открыть", web_app: { url: WEBAPP_URL } }]] }
}));

// можно добавить любые твои текущие хендлеры тут

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Проверяем секрет вебхука (если задан)
    if (SECRET) {
      const hdr = req.headers["x-telegram-bot-api-secret-token"];
      if (hdr !== SECRET) {
        res.status(401).end();
        return;
      }
    }
    // Обрабатываем апдейт
    await bot.handleUpdate(req.body as any);
  } catch (e) {
    console.error("Bot error:", e);
  }
  // ВАЖНО: быстро ответить 200
  res.status(200).end();
}
