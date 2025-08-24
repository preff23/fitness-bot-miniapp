module.exports = async (req, res) => {
  try {
    console.log('🧪 Тестовый webhook получен:', {
      method: req.method,
      headers: req.headers,
      body: req.body
    });
    
    // Симулируем channel_post
    const testUpdate = {
      update_id: 123456789,
      channel_post: {
        message_id: 999,
        date: Math.floor(Date.now() / 1000),
        chat: {
          id: -1002544629054,
          title: "Test",
          username: "fitnesstest",
          type: "channel"
        },
        text: "Тестовый пост из webhook"
      }
    };
    
    console.log('📝 Тестовый update:', JSON.stringify(testUpdate, null, 2));
    
    res.status(200).json({
      ok: true,
      message: 'Тестовый webhook обработан',
      test_update: testUpdate
    });
  } catch (error) {
    console.error('❌ Ошибка в тестовом webhook:', error);
    res.status(200).json({ ok: false, error: error.message });
  }
};
