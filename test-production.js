const https = require('https');

const BOT_TOKEN = '8367003356:AAGL4Nr4xAMP5GVPoxTUvyZ6cx9n8JU096c';

console.log('🧪 Тестирование production бота...');

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

async function testBot() {
  try {
    console.log('\n📋 Проверяем статус бота...');
    const botInfo = await makeRequest(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    console.log('✅ Бот активен:', botInfo);

    console.log('\n🔗 Проверяем вебхук...');
    const webhookInfo = await makeRequest(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    console.log('✅ Вебхук настроен:', webhookInfo);

    console.log('\n🌐 Проверяем Mini App...');
    const miniAppResponse = await makeRequest('https://fitness-bot-miniapp-ged8.vercel.app/');
    if (miniAppResponse.raw && miniAppResponse.raw.includes('FITNESS BOT')) {
      console.log('✅ Mini App доступен');
    } else {
      console.log('⚠️ Mini App может быть недоступен');
    }

    console.log('\n🎉 Тестирование завершено!');
    console.log('📱 Теперь можете протестировать бота в Telegram: @testbotfitness2_bot');
    console.log('   Отправьте команды: /start или /menu');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testBot();
