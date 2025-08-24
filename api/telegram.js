const { db } = require('../lib/firebase');

// Функция для проверки постов канала через polling
async function checkChannelPosts() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUpdates?allowed_updates=["channel_post"]&limit=10`);
    const data = await response.json();
    
    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        if (update.channel_post) {
          const post = update.channel_post;
          const channelUsername = process.env.CHANNEL_USERNAME;
          
          console.log('📨 Получен channel_post через polling:', {
            chatUsername: post.chat?.username,
            channelUsername: channelUsername,
            messageId: post.message_id,
            text: post.text?.substring(0, 50) + '...'
          });
          
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
            console.log('📝 Пост сохранен в Firebase через polling:', id);
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Ошибка при проверке постов канала:', error);
  }
}

module.exports = async (req, res) => {
  console.log('📨 Получен запрос от Telegram:', {
    method: req.method,
    body: req.body,
    hasMessage: !!req.body.message,
    hasChannelPost: !!req.body.channel_post
  });

  try {
    const { message, channel_post } = req.body;
    
    // Проверяем посты канала через polling
    await checkChannelPosts();
    
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
    if (channel_post) {
      const post = channel_post;
      const channelUsername = process.env.CHANNEL_USERNAME;
      
      console.log('📨 Получен channel_post:', {
        chatUsername: post.chat?.username,
        channelUsername: channelUsername,
        messageId: post.message_id,
        text: post.text?.substring(0, 50) + '...'
      });
      
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
      } else {
        console.log('❌ Пост не из нашего канала или нет username');
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
  
  res.status(200).json({ ok: true });
};
