require('dotenv').config();
const { Telegraf } = require('telegraf');

const WEBAPP_URL = process.env.WEBAPP_URL || "https://fitness-bot-miniapp.vercel.app/"; // мини-приложение

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const kb = {
    reply_markup: {
      keyboard: [[{ text: "Фитнес меню", web_app: { url: WEBAPP_URL } }]],
      resize_keyboard: true,
      is_persistent: true,
    },
  };
  await ctx.reply(
    "Привет! Я персональный тренер.\nОткрывай меню, чтобы выбрать тренировки.",
    kb
  );
});

bot.command("menu", async (ctx) => {
  const ikb = {
    reply_markup: {
      inline_keyboard: [[{ text: "Открыть фитнес-меню", web_app: { url: WEBAPP_URL } }]],
    },
  };
  await ctx.reply("Открой фитнес-меню:", ikb);
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
