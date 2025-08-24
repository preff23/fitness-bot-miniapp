// api/telegram.ts
import { Telegraf } from "telegraf";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const MINIAPP_URL = process.env.MINIAPP_URL || process.env.WEBAPP_URL!;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is required");
if (!MINIAPP_URL) throw new Error("MINIAPP_URL or WEBAPP_URL is required");

const bot = new Telegraf(BOT_TOKEN);

// Общая клавиатура с web_app-кнопкой
const getMenuKeyboard = () => ({
  keyboard: [[{ text: '🟠 ОТКРЫТЬ МЕНЮ', web_app: { url: MINIAPP_URL } }]],
  is_persistent: true,
  resize_keyboard: true,
  input_field_placeholder: 'Открыть меню',
});

// Приветствие + показ клавиатуры
bot.start(async (ctx) => {
  try {
    const message = await ctx.reply(
      'Привет!\nМеня зовут Денис,\nЯ - твой личный гид в мире спорта\n\nПогнали тренироваться вместе 💪\n\nЖми на кнопку 👇',
      {
        reply_markup: getMenuKeyboard(),
      }
    );

    // Пробуем закрепить приветствие (в приватах может не работать)
    try {
      await ctx.telegram.pinChatMessage(ctx.chat.id, message.message_id, { 
        disable_notification: true 
      });
    } catch (pinError) {
      // Игнорируем ошибку закрепления (нет прав или приватный чат)
      console.log("[pin message] Cannot pin message, skipping...");
    }
  } catch (e) {
    console.error("[start error]", e);
  }
});

// Команда меню
bot.command("menu", async (ctx) => {
  try {
    await ctx.reply("🔥 Открой фитнес-меню:", {
      reply_markup: getMenuKeyboard(),
    });
  } catch (e) {
    console.error("[menu error]", e);
  }
});

// Если пользователь что-то пишет — убеждаемся, что клавиатура на месте
bot.on('text', async (ctx, next) => {
  try {
    // Проверяем, не является ли это нажатием на кнопку меню
    if (ctx.message.text === '🟠 ОТКРЫТЬ МЕНЮ') {
      await ctx.reply('🚀 Отлично! Меню уже открывается в мини-приложении.', {
        reply_markup: getMenuKeyboard(),
      });
    } else {
      await ctx.reply('📱 Нажмите «🟠 ОТКРЫТЬ МЕНЮ», чтобы перейти в мини-приложение.', {
        reply_markup: getMenuKeyboard(),
      });
    }
  } catch (e) {
    console.error("[text handler error]", e);
  }
  return next();
});

// Простое логирование постов канала (без сохранения)
bot.on("channel_post", (ctx) => {
  const m = ctx.channelPost;
  const text = ('text' in m ? m.text : 'caption' in m ? m.caption : "") || "";
  console.log("[channel_post]", {
    chat_id: m?.chat?.id,
    username: m?.chat?.username,
    message_id: m?.message_id,
    text: text.slice(0, 100)
  });
});

bot.on("edited_channel_post", (ctx) => {
  const m = ctx.editedChannelPost;
  const text = ('text' in m ? m.text : 'caption' in m ? m.caption : "") || "";
  console.log("[edited_channel_post]", {
    chat_id: m?.chat?.id, 
    username: m?.chat?.username,
    message_id: m?.message_id,
    text: text.slice(0, 100)
  });
});

// ===== serverless handler =====
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ 
        ok: true, 
        ping: true, 
        ts: Date.now(), 
        bot: "fitness-trainer",
        miniapp_url: MINIAPP_URL 
      });
    }
    await bot.handleUpdate(req.body as any);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[webhook error]", e);
    return res.status(200).json({ ok: true });
  }
}