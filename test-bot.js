require('dotenv').config();
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN || '8367003356:AAGL4Nr4xAMP5GVPoxTUvyZ6cx9n8JU096c';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://fitness-bot-miniapp-ged8.vercel.app/';

console.log('🔧 Тестирование бота...');
console.log('📱 BOT_TOKEN:', BOT_TOKEN ? '✅ Настроен' : '❌ Отсутствует');
console.log('🌐 WEBAPP_URL:', WEBAPP_URL);

const bot = new Telegraf(BOT_TOKEN);

// Тестовые хендлеры
bot.start((ctx) => {
  console.log('✅ /start команда получена');
  ctx.reply(
    "Привет! Я персональный тренер.\nОткрой фитнес-меню:",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Открыть фитнес-меню", web_app: { url: WEBAPP_URL } }]],
      },
    }
  );
});

bot.command("menu", (ctx) => {
  console.log('✅ /menu команда получена');
  ctx.reply("Открой фитнес-меню:", {
    reply_markup: { inline_keyboard: [[{ text: "Открыть", web_app: { url: WEBAPP_URL } }]] }
  });
});

// Тест получения информации о боте
bot.telegram.getMe().then((botInfo) => {
  console.log('🤖 Информация о боте:');
  console.log('   Имя:', botInfo.first_name);
  console.log('   Username:', botInfo.username);
  console.log('   ID:', botInfo.id);
  console.log('✅ Бот готов к работе!');
  console.log('📝 Отправьте /start или /menu в Telegram для тестирования');
});

bot.launch();

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
