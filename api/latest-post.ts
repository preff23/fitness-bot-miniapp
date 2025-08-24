// api/latest-post.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME || "@fitnesstest";
const CHANNEL_ID = process.env.CHANNEL_ID;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  
  try {
    if (!BOT_TOKEN) {
      return res.status(200).json({ 
        ok: false, 
        error: "BOT_TOKEN not configured" 
      });
    }

    // Используем ID канала если есть, иначе username
    const chatId = CHANNEL_ID || CHANNEL_USERNAME;
    
    // Получаем информацию о канале
    const chatUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${encodeURIComponent(chatId)}`;
    const chatResponse = await fetch(chatUrl);
    const chatData = await chatResponse.json();
    
    if (!chatData.ok) {
      return res.status(200).json({
        ok: false,
        error: "Failed to get channel info",
        details: chatData.description,
        chatId: chatId
      });
    }

    // Мокаем несколько тестовых постов для демонстрации
    const mockPosts = [
      {
        id: "1001",
        date: Math.floor(Date.now() / 1000) - 3600, // 1 час назад
        text: "🔥 Новая тренировка на сегодня!\n\nСегодня делаем акцент на кардио и силовые упражнения. Не забудьте про разминку!",
        has_media: false,
        photos: [],
        entities: []
      },
      {
        id: "1002", 
        date: Math.floor(Date.now() / 1000) - 7200, // 2 часа назад
        text: "💪 Помните: главное - постоянство!\n\nЛучше делать по 15 минут каждый день, чем 2 часа раз в неделю.",
        has_media: false,
        photos: [],
        entities: []
      },
      {
        id: "1003",
        date: Math.floor(Date.now() / 1000) - 86400, // 1 день назад  
        text: "🥗 Правильное питание = 70% успеха\n\nДелитесь своими любимыми полезными рецептами в комментариях!",
        has_media: false,
        photos: [],
        entities: []
      }
    ];

    res.status(200).json({
      ok: true,
      items: mockPosts,
      channel: {
        id: chatData.result.id,
        title: chatData.result.title,
        username: chatData.result.username,
        type: chatData.result.type
      },
      message: "Showing mock posts (real Telegram API method for channel posts requires admin access)",
      total: mockPosts.length
    });

  } catch (error: any) {
    console.error("[latest-post error]", error);
    res.status(200).json({
      ok: false,
      error: error.message || "Unknown error"
    });
  }
}
