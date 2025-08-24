const { db } = require('../lib/firebase');

module.exports = async function handler(req, res) {
  try {
    console.log('🔍 Проверяем посты канала...');
    
    const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUpdates?allowed_updates=["channel_post"]&limit=10`);
    const data = await response.json();
    
    console.log('📊 Результат getUpdates:', {
      ok: data.ok,
      resultCount: data.result ? data.result.length : 0
    });
    
    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        if (update.channel_post) {
          const post = update.channel_post;
          const channelUsername = process.env.CHANNEL_USERNAME;
          
          console.log('📨 Найден channel_post:', {
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
          }
        }
      }
    } else {
      console.log('❌ Нет новых постов канала');
    }
    
    res.status(200).json({
      ok: true,
      message: 'Проверка постов завершена',
      updatesFound: data.ok ? data.result.length : 0
    });
  } catch (error) {
    console.error('❌ Ошибка при проверке постов:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};
