module.exports = async function handler(req, res) {
  try {
    console.log('🔧 Простой тест Firebase...');
    
    // Пробуем импортировать Firebase
    const { db } = require('../lib/firebase');
    console.log('✅ Firebase импортирован успешно');
    
    // Пробуем простую операцию
    const testRef = db.ref('/simple-test');
    await testRef.set({
      timestamp: Date.now(),
      message: 'Simple Firebase test'
    });
    console.log('✅ Запись в Firebase успешна');
    
    // Удаляем тестовые данные
    await testRef.remove();
    console.log('✅ Тестовые данные удалены');
    
    res.status(200).json({
      ok: true,
      message: 'Firebase работает!',
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error('❌ Ошибка Firebase:', error);
    res.status(200).json({
      ok: false,
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 5) // Первые 5 строк стека
    });
  }
};
