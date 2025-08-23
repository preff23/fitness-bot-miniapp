const https = require('https');

console.log('🔧 Настройка переменных окружения в Vercel...');

// Данные для Vercel
const VERCEL_TOKEN = process.env.VERCEL_TOKEN; // Нужно получить из Vercel Dashboard
const PROJECT_ID = 'fitness-bot-miniapp'; // ID проекта в Vercel

const envVars = {
  BOT_TOKEN: '7530980547:AAFxX3IUtXcz89f9gPEJ778TpCXBiG2ykbA',
  WEBAPP_URL: 'https://fitness-bot-miniapp-ged8.vercel.app/',
  CHANNEL_USERNAME: '@fitnesstest',
  FIREBASE_PROJECT_ID: 'fitnessbot-3a07b',
  FIREBASE_CLIENT_EMAIL: 'firebase-adminsdk-fbsvc@fitnessbot-3a07b.iam.gserviceaccount.com',
  FIREBASE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWhjiPdDTxOZ0z\nx9ivL9zn8finp69DZCGqz2KxbZn35+/QLKzdJNbRpbhX4dwzmV8MJyBX3ANhAKQ2\nKJ61TeV7aOKa/BABStA1V1VD6eyeDOCVLjJlRFNI/NSG7A6+xywuVz/ydyxSizm5\neCnINWb4w4I0mJazCzhqMWEK+/YN4lbr/O+az0ujkQ96mUpCgnzNyW2rgl7jv+Jw\nckpSCdo5N/oVGEjzGB15VZLxUgc7pu8nJcssK45oNQ+6/Rw7aiIaedKhup5ItZ1H\nynUW5W//4I1Y5VHS9nNRLw0wLJrtEHFHErdf6pek6DFRW742TAOr7Gs6ABGXSUQY\nmfFtQ26bAgMBAAECggEAAWqQGQewCcpS6rKZEEmv8FVn9Ni7OXtXFY+aRohDX0ry\ntFx3JQackcnBoSLml0NIngXsGr24b/2BwrHF9SB3MWIMjPAOaFPGyB4JfBH2npyA\nfGZPrYd5R/QTWx4CgulBthScDCJpR9TkzqqnwUtI9hTPA+s1+NH2z2IAEq3TKV2g\nE4iBcHK2lSxBGSzCx/1azgfs3yewonMweg+5un2ZoMDo8WceVDr3ji4Iy0V5PQ6A\n5j8PJb0SsydT49FgRs6nd+M68nkpOqqeWFr053zAP6TS5OT2YvIW0MeqLTO09dLQ\nUxdew09YTj6h+uWNlOgsw/iEpo/mAVZ+tfKAgSubgQKBgQDwnAXdPHB3XcUAwndz\nBxrHP3v+OXp2IhZEvUbc/3jmnIqMkaTIpLakvgbRiP9vHoNODqiGJ4aDhREdW/8O\nXLLok0lp6QNcspTe0HMaz5LqaMp8bFLG6zDpjm7ruTVQKocpM1SMZabe4HlZgG92\ndS7ILirDOF1DT1lPJL1klCEEIQKBgQDkPw3E4tEBTsTMAAGFh9k8bYZ9y6JDytbS\n//fgxPXchkUTyaCgpGTBBuQSSWWe5nZ9i7GyND45sWxNmc5E/CS4OKyP8qLrsp5e\n06lxSeSgLevvj/X5zQ/WKjUcnOcGAi1JURBM5IF73rNYSrDUTUn/17icUpGCNX8d\nUdAOBzgbOwKBgDNhbhMnc/DZklcuL+nda4d+9BB+37rYXp8BOF+7ImtEpIWOGH1M\nR0B43+Xg9oMZJfsGQFCdoij1wojde2Lqwr3NrhCy1Kf37riCFQJ1ry7lf9AAJdEa\nqlBFvUQTQeJDoqdWschlcLQJhYBqX+MQ9ROEYFdd8vSLvkubUeJni4FhAoGBAKYM\ncTnxQNhQs78tqe25HQNnMtbFlHD5Wjv62Bx/bdZXIF36646yylHbb4UWPIXTaBSB\n0m6wryxNtVrnMDbjsNsM8A1xGbGbKrgWCElQ1rDpd6G6+9oVoxXNcwIz66ZlYwjZ\nnqAyBTlWlOcAv5BUAifMipO/RfiSbr2nzVLHUbwNAoGAVhlLz02o/+m3K6DXKKEj\npNz/r1mnnxCOuCoULRtnJoU6RfQrdgAiJmm4+c1tkAZ99HwP4r72hAPm3929e/8P\nIi30c7brKI0cIU8ywuqSkCXWd5ddlcmc4NcpyZ/GHeNxn2O93fuLu7SoZ/Cz1A3+\nTTKLA7DpdAw4wjvCBTNHgg8=\n-----END PRIVATE KEY-----\n'
};

if (!VERCEL_TOKEN) {
  console.log('❌ VERCEL_TOKEN не найден!');
  console.log('📋 Инструкция:');
  console.log('1. Откройте Vercel Dashboard');
  console.log('2. Перейдите в Settings → Tokens');
  console.log('3. Создайте новый токен');
  console.log('4. Установите переменную: export VERCEL_TOKEN=your_token');
  console.log('');
  console.log('🔧 Или добавьте переменные вручную в Vercel Dashboard:');
  console.log('Project Settings → Environment Variables');
  console.log('');
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
  process.exit(1);
}

// Функция для добавления переменной окружения
function addEnvVar(key, value) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      key,
      value,
      target: ['production', 'preview', 'development']
    });

    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: `/v10/projects/${PROJECT_ID}/env`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${key} добавлена`);
          resolve();
        } else {
          console.log(`❌ Ошибка добавления ${key}:`, responseData);
          reject(new Error(responseData));
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Ошибка запроса для ${key}:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function setupEnvVars() {
  try {
    console.log('📝 Добавляем переменные окружения...');
    
    for (const [key, value] of Object.entries(envVars)) {
      await addEnvVar(key, value);
    }
    
    console.log('🎉 Все переменные окружения добавлены!');
    console.log('🔄 Перезапустите деплой в Vercel Dashboard');
    
  } catch (error) {
    console.error('❌ Ошибка настройки:', error.message);
  }
}

setupEnvVars();
