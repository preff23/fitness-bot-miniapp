// api/posts-simple.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME || "@fitnesstest";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  
  try {
    if (!BOT_TOKEN) {
      return res.status(200).json({ 
        ok: false, 
        error: "BOT_TOKEN not configured" 
      });
    }

    // Получаем последние сообщения из канала через Telegram API
    const limit = Math.min(parseInt(String(req.query.limit || "10"), 10), 50);
    
    // Используем getUpdates для получения последних сообщений
    const updatesUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?allowed_updates=["channel_post"]&limit=${limit}`;
    
    const response = await fetch(updatesUrl);
    const data = await response.json();
    
    if (!data.ok) {
      return res.status(200).json({
        ok: false,
        error: "Failed to fetch from Telegram API",
        details: data.description
      });
    }

    // Фильтруем только посты из нужного канала
    const channelPosts = data.result
      .filter((update: any) => {
        const post = update.channel_post;
        if (!post) return false;
        
        const chatUsername = "@" + (post.chat?.username || "");
        return chatUsername.toLowerCase() === CHANNEL_USERNAME.toLowerCase();
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

    res.status(200).json({
      ok: true,
      items: channelPosts,
      channel: CHANNEL_USERNAME,
      total: channelPosts.length
    });

  } catch (error: any) {
    console.error("[posts-simple error]", error);
    res.status(200).json({
      ok: false,
      error: error.message || "Unknown error"
    });
  }
}
