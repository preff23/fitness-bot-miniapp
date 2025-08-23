// const { db } = require('../lib/firebase'); // Временно отключено

module.exports = async (req, res) => {
  console.log('📨 Получен запрос от Telegram');
  
  try {
    const { message, channel_post } = req.body;
    
    if (message && message.text) {
      console.log('💬 Сообщение:', message.text);
      
      if (message.text === '/start') {
        const response = {
          method: 'sendMessage',
          chat_id: message.chat.id,
          text: 'Привет! Я персональный тренер.\nОткрой фитнес-меню:',
          reply_markup: {
            inline_keyboard: [[
              { 
                text: "Открыть фитнес-меню", 
                web_app: { 
                  url: "https://fitness-bot-miniapp-ged8.vercel.app/" 
                } 
              }
            ]]
          }
        };
        
        await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        });
        
        console.log('✅ Ответ отправлен на /start');
      }
      
      if (message.text === '/menu') {
        const response = {
          method: 'sendMessage',
          chat_id: message.chat.id,
          text: 'Открой фитнес-меню:',
          reply_markup: {
            inline_keyboard: [[
              { 
                text: "Открыть", 
                web_app: { 
                  url: "https://fitness-bot-miniapp-ged8.vercel.app/" 
                } 
              }
            ]]
          }
        };
        
        await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        });
        
        console.log('✅ Ответ отправлен на /menu');
      }
    }
    
    // === Обработчик постов канала ===
    // Временно отключено - требует настройки Firebase
    /*
    if (channel_post) {
      const post = channel_post;
      const channelUsername = process.env.CHANNEL_USERNAME;
      
      // Сохраняем только из нашего канала
      if (post.chat && post.chat.username && 
          `@${post.chat.username}`.toLowerCase() === channelUsername.toLowerCase()) {
        
        const id = String(post.message_id);
        const payload = {
          id,
          date: post.date,
          text: post.text || post.caption || "",
          entities: post.entities || post.caption_entities || [],
          photos: (post.photo || []).map((p) => p.file_id),
          has_media: !!post.photo,
        };
        
        await db.ref(`/posts/${id}`).set(payload);
        console.log('📝 Пост сохранен в Firebase:', id);
      }
    }
    */
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
  
  res.status(200).json({ ok: true });
};
