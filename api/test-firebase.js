const { db } = require('../lib/firebase');

module.exports = async function handler(req, res) {
  try {
    console.log('🔧 Тестирование Firebase подключения...');
    
    // Проверяем переменные окружения
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    console.log('📋 Переменные окружения:');
    console.log('FIREBASE_PROJECT_ID:', projectId ? '✅ Настроен' : '❌ Отсутствует');
    console.log('FIREBASE_CLIENT_EMAIL:', clientEmail ? '✅ Настроен' : '❌ Отсутствует');
    console.log('FIREBASE_PRIVATE_KEY:', privateKey ? '✅ Настроен' : '❌ Отсутствует');
    
    if (!projectId || !clientEmail || !privateKey) {
      return res.status(200).json({
        ok: false,
        error: 'Missing Firebase environment variables',
        missing: {
          projectId: !projectId,
          clientEmail: !clientEmail,
          privateKey: !privateKey
        }
      });
    }
    
    // Пробуем подключиться к Firebase
    console.log('🔗 Подключение к Firebase...');
    const testRef = db.ref('/test');
    await testRef.set({
      timestamp: Date.now(),
      message: 'Firebase connection test'
    });
    
    console.log('✅ Firebase подключение успешно!');
    
    // Удаляем тестовые данные
    await testRef.remove();
    
    res.status(200).json({
      ok: true,
      message: 'Firebase подключение работает!',
      projectId: projectId,
      clientEmail: clientEmail
    });
    
  } catch (error) {
    console.error('❌ Ошибка Firebase:', error);
    res.status(200).json({
      ok: false,
      error: error.message,
      stack: error.stack
    });
  }
};
