module.exports = async function handler(req, res) {
  try {
    console.log('🔧 Диагностика переменных окружения...');
    
    const envVars = {
      BOT_TOKEN: process.env.BOT_TOKEN,
      WEBAPP_URL: process.env.WEBAPP_URL,
      CHANNEL_USERNAME: process.env.CHANNEL_USERNAME,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY
    };
    
    const status = {};
    Object.entries(envVars).forEach(([key, value]) => {
      status[key] = {
        exists: !!value,
        length: value ? value.length : 0,
        preview: value ? value.substring(0, 20) + '...' : 'null'
      };
    });
    
    res.status(200).json({
      ok: true,
      message: 'Диагностика переменных окружения',
      status: status,
      missing: Object.entries(envVars).filter(([key, value]) => !value).map(([key]) => key)
    });
    
  } catch (error) {
    console.error('❌ Ошибка диагностики:', error);
    res.status(200).json({
      ok: false,
      error: error.message
    });
  }
};
