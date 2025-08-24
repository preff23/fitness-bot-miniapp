const https = require('https');

console.log('🔍 Диагностика проблем с Vercel...');

// Функция для выполнения HTTP запросов
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function diagnose() {
  try {
    console.log('\n1️⃣ Проверяем основной сайт...');
    const mainSite = await makeRequest('https://fitness-bot-miniapp-ged8.vercel.app/');
    console.log('✅ Основной сайт доступен, статус:', mainSite.statusCode);

    console.log('\n2️⃣ Проверяем health endpoint...');
    try {
      const health = await makeRequest('https://fitness-bot-miniapp-ged8.vercel.app/api/health');
      console.log('✅ Health endpoint работает, статус:', health.statusCode);
      console.log('📄 Ответ:', health.data.substring(0, 200) + '...');
    } catch (e) {
      console.log('❌ Health endpoint недоступен:', e.message);
    }

    console.log('\n3️⃣ Проверяем telegram endpoint...');
    try {
      const telegram = await makeRequest('https://fitness-bot-miniapp-ged8.vercel.app/api/telegram');
      console.log('✅ Telegram endpoint доступен, статус:', telegram.statusCode);
    } catch (e) {
      console.log('❌ Telegram endpoint недоступен:', e.message);
    }

    console.log('\n4️⃣ Проверяем вебхук...');
    const webhookInfo = await makeRequest('https://api.telegram.org/bot8367003356:AAGL4Nr4xAMP5GVPoxTUvyZ6cx9n8JU096c/getWebhookInfo');
    console.log('✅ Вебхук настроен:', JSON.parse(webhookInfo.data));

    console.log('\n📋 Рекомендации:');
    console.log('1. Если health endpoint недоступен - серверлесс функции не развернулись');
    console.log('2. Проверьте логи в Vercel Dashboard → Functions → Logs');
    console.log('3. Убедитесь, что переменные окружения добавлены правильно');
    console.log('4. Попробуйте пересобрать проект в Vercel Dashboard');

  } catch (error) {
    console.error('❌ Ошибка диагностики:', error.message);
  }
}

diagnose();
