// api/posts.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  
  try {
    // Простые мокированные посты для демонстрации новостной ленты
    const mockPosts = [
      {
        id: "100",
        date: Math.floor(Date.now() / 1000) - 1800, // 30 минут назад
        text: "🔥 ЖИРОСЖИГАЮЩАЯ ТРЕНИРОВКА НА 20 МИНУТ\n\nСегодня предлагаю вам интенсивную кардио-тренировку, которая поможет сжечь максимум калорий за минимальное время!\n\n💪 Включает: берпи, прыжки, планки\n⏰ Всего 20 минут\n🔥 Сжигает до 300 калорий",
        has_media: false,
        photos: [],
        entities: []
      },
      {
        id: "101", 
        date: Math.floor(Date.now() / 1000) - 7200, // 2 часа назад
        text: "💡 СОВЕТ ДНЯ: ВАЖНОСТЬ ВОССТАНОВЛЕНИЯ\n\nМногие забывают, что мышцы растут не во время тренировки, а во время отдыха!\n\n✅ 7-9 часов сна\n✅ 1-2 дня отдыха в неделю\n✅ Правильное питание\n\nПомните: перетренированность = шаг назад!",
        has_media: false,
        photos: [],
        entities: []
      },
      {
        id: "102",
        date: Math.floor(Date.now() / 1000) - 14400, // 4 часа назад
        text: "🥗 РЕЦЕПТ: ПРОТЕИНОВЫЙ СМУЗИ\n\nИдеальный завтрак для тех, кто хочет похудеть:\n\n• 200мл миндального молока\n• 30г протеина (ваниль)\n• 1 банан\n• 1 ст.л. арахисовой пасты\n• горсть шпината\n• лед\n\n📊 Калории: ~350\n💪 Белок: ~35г",
        has_media: false,
        photos: [],
        entities: []
      },
      {
        id: "103",
        date: Math.floor(Date.now() / 1000) - 28800, // 8 часов назад
        text: "⚡ МОТИВАЦИЯ ПОНЕДЕЛЬНИКА\n\n\"Твое тело может выдержать почти все. Твой разум должен убедить его в этом.\"\n\nКаждый понедельник - это новый шанс стать лучше! Не откладывай на завтра то, что можешь сделать сегодня.\n\n🎯 Какая твоя цель на эту неделю?",
        has_media: false,
        photos: [],
        entities: []
      }
    ];

    res.status(200).json({
      ok: true,
      items: mockPosts,
      total: mockPosts.length,
      message: "Mock fitness posts (no database required)"
    });

  } catch (error: any) {
    console.error("[posts error]", error);
    res.status(200).json({
      ok: false,
      error: error.message || "unknown"
    });
  }
}
