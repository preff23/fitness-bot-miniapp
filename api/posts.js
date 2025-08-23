const { db } = require('../lib/firebase');

module.exports = async function handler(req, res) {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || "20"), 10), 50);
    
    // Читаем все посты (без сортировки)
    const snap = await db.ref("/posts").limitToLast(limit).get();
    const list = [];
    
    snap.forEach((c) => list.push(c.val()));
    
    // Сортируем по дате на клиенте
    list.sort((a, b) => b.date - a.date);
    
    res.status(200).json({ ok: true, items: list });
  } catch (e) {
    console.error('❌ Ошибка получения постов:', e);
    res.status(200).json({ ok: false, error: e.message || "unknown" });
  }
};
