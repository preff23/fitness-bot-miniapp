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

    // Получаем информацию о канале
    const chatUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${encodeURIComponent(CHANNEL_USERNAME)}`;
    const chatResponse = await fetch(chatUrl);
    const chatData = await chatResponse.json();
    
    if (!chatData.ok) {
      console.error("[posts] Failed to get channel info:", chatData.description);
      return res.status(200).json({
        ok: false,
        error: `Cannot access channel ${CHANNEL_USERNAME}: ${chatData.description}`,
        items: [],
        total: 0
      });
    }

    const channelInfo = chatData.result;
    
    // Пытаемся получить последние сообщения через getUpdates
    // Примечание: это может не работать для публичных каналов без админских прав
    try {
      const updatesUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?allowed_updates=["channel_post"]&limit=100`;
      const updatesResponse = await fetch(updatesUrl);
      const updatesData = await updatesResponse.json();
      
      if (updatesData.ok && updatesData.result.length > 0) {
        // Фильтруем посты из нужного канала
        const channelPosts = updatesData.result
          .filter((update: any) => {
            const post = update.channel_post;
            if (!post) return false;
            return post.chat.id === channelInfo.id;
          })
          .map((update: any) => {
            const post = update.channel_post;
            return {
              id: String(post.message_id),
              date: post.date,
              text: post.text || post.caption || "",
              has_media: Boolean(post.photo || post.video || post.document),
              photos: (post.photo || []).map((p: any) => p.file_id),
              entities: post.entities || post.caption_entities || []
            };
          })
          .sort((a: any, b: any) => b.date - a.date); // Сортируем по дате (новые сначала)

        if (channelPosts.length > 0) {
          return res.status(200).json({
            ok: true,
            items: channelPosts.slice(0, 5), // Возвращаем топ-5 постов
            total: channelPosts.length,
            channel: CHANNEL_USERNAME,
            source: "telegram_api"
          });
        }
      }
    } catch (apiError) {
      console.error("[posts] Telegram API error:", apiError);
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
