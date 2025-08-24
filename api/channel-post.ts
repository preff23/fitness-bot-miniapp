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
            
            // Простой парсинг последнего поста (ищем паттерны в HTML)
            const postMatch = html.match(/<div class="tgme_widget_message_text[^>]*>(.*?)<\/div>/s);
            const dateMatch = html.match(/<time[^>]*datetime="([^"]*)"[^>]*>/);
            
            if (postMatch && postMatch[1]) {
              // Очищаем HTML теги и энтити
              const cleanText = postMatch[1]
                .replace(/<[^>]*>/g, '') // убираем HTML теги
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&#33;/g, '!')
                .replace(/&#39;/g, "'")
                .replace(/&#(\d+);/g, (match, num) => String.fromCharCode(parseInt(num))) // все числовые энтити
                .trim();
              
              const postDate = dateMatch ? new Date(dateMatch[1]).getTime() / 1000 : Math.floor(Date.now() / 1000);
              
              if (cleanText.length > 0) {
                return res.status(200).json({
                  ok: true,
                  items: [{
                    id: "latest_from_web",
                    date: postDate,
                    text: cleanText,
                    has_media: false,
                    photos: [],
                    entities: []
                  }],
                  total: 1,
                  channel: CHANNEL_USERNAME,
                  source: "web_scraping",
                  channel_info: {
                    title: channelInfo.title,
                    username: channelInfo.username,
                    subscribers: channelInfo.members_count || "неизвестно"
                  }
                });
              }
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
