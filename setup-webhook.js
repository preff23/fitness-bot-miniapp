const https = require('https');

const BOT_TOKEN = '8367003356:AAGL4Nr4xAMP5GVPoxTUvyZ6cx9n8JU096c';
const WEBHOOK_URL = 'https://fitness-bot-miniapp-ged8.vercel.app/api/telegram';
const SECRET_TOKEN = 'fitness-bot-secret-2024';

console.log('🔧 Настройка вебхука для бота...');
console.log('🤖 BOT_TOKEN:', BOT_TOKEN);
console.log('🌐 WEBHOOK_URL:', WEBHOOK_URL);
console.log('🔐 SECRET_TOKEN:', SECRET_TOKEN);

// Функция для выполнения HTTP запросов
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          resolve({ raw: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function setupWebhook() {
  try {
    // 1. Проверяем текущий статус вебхука
    console.log('\n📋 Проверяем текущий статус вебхука...');
    const webhookInfo = await makeRequest(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    console.log('Текущий вебхук:', webhookInfo);

    // 2. Устанавливаем новый вебхук
    console.log('\n🔗 Устанавливаем вебхук...');
    const setWebhookUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${encodeURIComponent(WEBHOOK_URL)}&secret_token=${SECRET_TOKEN}`;
    const setResult = await makeRequest(setWebhookUrl);
    console.log('Результат установки вебхука:', setResult);

    // 3. Проверяем, что вебхук установлен
    console.log('\n✅ Проверяем установку вебхука...');
    const newWebhookInfo = await makeRequest(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    console.log('Новый статус вебхука:', newWebhookInfo);

    if (newWebhookInfo.ok && newWebhookInfo.result.url === WEBHOOK_URL) {
      console.log('\n🎉 Вебхук успешно настроен!');
      console.log('🤖 Бот теперь работает через Vercel и будет отвечать 24/7');
      console.log('📱 Протестируйте бота в Telegram: @testbotfitness2_bot');
    } else {
      console.log('\n❌ Ошибка настройки вебхука');
      console.log('Возможные причины:');
      console.log('1. Переменные окружения не добавлены в Vercel');
      console.log('2. Серверлесс функции не развернулись');
      console.log('3. Неправильный URL вебхука');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

// Запускаем настройку
setupWebhook();
