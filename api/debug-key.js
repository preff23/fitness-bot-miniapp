module.exports = async function handler(req, res) {
  try {
    console.log('🔧 Отладка приватного ключа Firebase...');
    
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    if (!privateKey) {
      return res.status(200).json({
        ok: false,
        error: 'FIREBASE_PRIVATE_KEY не найден'
      });
    }
    
    // Показываем первые и последние символы
    const preview = {
      original: privateKey.substring(0, 50) + '...' + privateKey.substring(privateKey.length - 20),
      length: privateKey.length,
      startsWithQuote: privateKey.startsWith('"'),
      endsWithQuote: privateKey.endsWith('"'),
      containsNewlines: privateKey.includes('\\n'),
      containsActualNewlines: privateKey.includes('\n')
    };
    
    // Пробуем разные варианты обработки
    const processed1 = privateKey.replace(/\\n/g, "\n");
    const processed2 = processed1.replace(/^"|"$/g, "");
    
    preview.processed1 = processed1.substring(0, 50) + '...' + processed1.substring(processed1.length - 20);
    preview.processed2 = processed2.substring(0, 50) + '...' + processed2.substring(processed2.length - 20);
    
    res.status(200).json({
      ok: true,
      message: 'Отладка приватного ключа',
      preview: preview
    });
    
  } catch (error) {
    console.error('❌ Ошибка отладки:', error);
    res.status(200).json({
      ok: false,
      error: error.message
    });
  }
};
