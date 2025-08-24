// api/channel-post.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = "@Konovalsportlive";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  
  try {
    if (!BOT_TOKEN) {
      return res.status(200).json({ 
        ok: false, 
        error: "BOT_TOKEN not configured"
      });
    }

    // Способ 1: Пытаемся получить последние сообщения через getUserProfilePhotos + getChat
    try {
      const chatUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${encodeURIComponent(CHANNEL_USERNAME)}`;
      const chatResponse = await fetch(chatUrl);
      const chatData = await chatResponse.json();
      
      if (chatData.ok) {
        const channelInfo = chatData.result;
        
        // Способ 2: Используем веб-скрапинг t.me страницы (публичный канал)
        const channelWebUrl = `https://t.me/s/${CHANNEL_USERNAME.replace('@', '')}`;
        
        try {
          const webResponse = await fetch(channelWebUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (webResponse.ok) {
            const html = await webResponse.text();
            
            // Ищем все посты и выбираем самый свежий
            const messagePattern = /<div class="tgme_widget_message[^>]*data-post="[^"]*"[^>]*>(.*?)<\/div>\s*<\/div>\s*<\/div>/gs;
            const posts = [];
            let match;
            
            while ((match = messagePattern.exec(html)) !== null) {
              const messageHtml = match[1];
              
              // Ищем ID поста из data-post атрибута
              const postIdMatch = match[0].match(/data-post="([^"]+)"/);
              // Ищем текст поста
              const textMatch = messageHtml.match(/<div class="tgme_widget_message_text[^>]*>(.*?)<\/div>/s);
              // Ищем дату
              const dateMatch = messageHtml.match(/<time[^>]*datetime="([^"]*)"[^>]*>/);
              
              if (textMatch && textMatch[1] && dateMatch && dateMatch[1] && postIdMatch && postIdMatch[1]) {
                // Очищаем HTML теги и энтити
                const cleanText = textMatch[1]
                  .replace(/<[^>]*>/g, '')
                  .replace(/&quot;/g, '"')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&#33;/g, '!')
                  .replace(/&#39;/g, "'")
                  .replace(/&#(\d+);/g, (match, num) => String.fromCharCode(parseInt(num)))
                  .trim();
                
                if (cleanText.length > 0) {
                  const postDate = new Date(dateMatch[1]).getTime() / 1000;
                  const postId = postIdMatch[1]; // формат: "Konovalsportlive/123"
                  const messageId = postId.split('/')[1]; // извлекаем номер сообщения
                  
                  posts.push({
                    id: messageId || `latest_${posts.length}`,
                    date: postDate,
                    text: cleanText,
                    has_media: false,
                    photos: [],
                    entities: [],
                    post_url: `https://t.me/${CHANNEL_USERNAME.replace('@', '')}/${messageId}`, // прямая ссылка на пост
                    post_id: postId
                  });
                }
              }
            }
            
            // Сортируем по дате и берем самый свежий
            if (posts.length > 0) {
              posts.sort((a, b) => b.date - a.date);
              const latestPost = posts[0];
              
              return res.status(200).json({
                ok: true,
                items: [latestPost],
                total: 1,
                channel: CHANNEL_USERNAME,
                source: "web_scraping",
                channel_info: {
                  title: channelInfo.title,
                  username: channelInfo.username,
                  subscribers: channelInfo.members_count || "неизвестно"
                },
                debug: {
                  total_posts_found: posts.length,
                  latest_date: new Date(latestPost.date * 1000).toISOString()
                }
              });
            }
          }
        } catch (webError) {
          console.error("[channel-post] Web scraping error:", webError);
        }
        
        // Fallback: возвращаем информацию о канале с призывом подписаться
        return res.status(200).json({
          ok: true,
          items: [{
            id: "channel_info",
            date: Math.floor(Date.now() / 1000) - 300, // 5 минут назад
            text: `📺 Канал ${CHANNEL_USERNAME}\n\n${channelInfo.description || 'Спортивный канал с актуальными новостями'}\n\n👥 Подписчиков: ${channelInfo.members_count || 'много'}\n\n💡 Подпишитесь на канал, чтобы не пропустить последние новости!`,
            has_media: false,
            photos: [],
            entities: []
          }],
          total: 1,
          channel: CHANNEL_USERNAME,
          source: "channel_info",
          channel_info: channelInfo
        });
      }
    } catch (apiError) {
      console.error("[channel-post] Telegram API error:", apiError);
    }

    // Если ничего не получилось, возвращаем заглушку
    const fallbackPost = {
      id: "fallback_konoval",
      date: Math.floor(Date.now() / 1000) - 600, // 10 минут назад
      text: `🏃‍♂️ Канал ${CHANNEL_USERNAME}\n\n📢 Здесь публикуются свежие новости спорта и тренировок!\n\n🔗 Чтобы увидеть последние посты, перейдите в канал напрямую.\n\n⚠️ Для автоматического получения постов боту нужны особые права.`,
      has_media: false,
      photos: [],
      entities: []
    };

    res.status(200).json({
      ok: true,
      items: [fallbackPost],
      total: 1,
      channel: CHANNEL_USERNAME,
      source: "fallback"
    });

  } catch (error: any) {
    console.error("[channel-post error]", error);
    res.status(200).json({
      ok: false,
      error: error.message || "unknown",
      items: [],
      total: 0
    });
  }
}
