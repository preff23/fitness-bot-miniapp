// api/posts.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = "@Konovalsportlive";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  
  try {
    if (!BOT_TOKEN) {
      return res.status(200).json({ 
        ok: false, 
        error: "BOT_TOKEN not configured",
        items: [],
        total: 0
      });
    }

    // Пробуем веб-скрапинг как основной метод
    const channelWebUrl = `https://t.me/s/${CHANNEL_USERNAME.replace('@', '')}`;
    
    try {
      const webResponse = await fetch(channelWebUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (webResponse.ok) {
        const html = await webResponse.text();
        
        // Простой парсинг последнего поста
        const postMatch = html.match(/<div class="tgme_widget_message_text[^>]*>(.*?)<\/div>/s);
        const dateMatch = html.match(/<time[^>]*datetime="([^"]*)"[^>]*>/);
        
        if (postMatch && postMatch[1]) {
          // Очищаем HTML теги и энтити
          const cleanText = postMatch[1]
            .replace(/<[^>]*>/g, '')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#33;/g, '!')
            .replace(/&#39;/g, "'")
            .replace(/&#(\d+);/g, (match, num) => String.fromCharCode(parseInt(num)))
            .trim();
          
          const postDate = dateMatch ? new Date(dateMatch[1]).getTime() / 1000 : Math.floor(Date.now() / 1000);
          
          if (cleanText.length > 0) {
            return res.status(200).json({
              ok: true,
              items: [{
                id: "latest_web_post",
                date: postDate,
                text: cleanText,
                has_media: false,
                photos: [],
                entities: []
              }],
              total: 1,
              channel: CHANNEL_USERNAME,
              source: "web_scraping"
            });
          }
        }
      }
    } catch (webError) {
      console.error("[posts] Web scraping error:", webError);
    }

    // Если не удалось получить реальные посты, возвращаем fallback сообщение
    const fallbackPost = {
      id: "fallback_1",
      date: Math.floor(Date.now() / 1000) - 600, // 10 минут назад
      text: `📢 Последние новости из канала ${CHANNEL_USERNAME}\n\n💡 Для просмотра актуальных постов откройте канал напрямую.\n\n🔗 Канал доступен, но для автоматического получения постов боту нужны права администратора.`,
      has_media: false,
      photos: [],
      entities: []
    };

    res.status(200).json({
      ok: true,
      items: [fallbackPost],
      total: 1,
      channel: CHANNEL_USERNAME,
      source: "fallback",
      message: "Bot needs admin rights in channel to fetch real posts"
    });

  } catch (error: any) {
    console.error("[posts error]", error);
    res.status(200).json({
      ok: false,
      error: error.message || "unknown",
      items: [],
      total: 0
    });
  }
}
