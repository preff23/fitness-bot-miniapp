// const { db } = require('../lib/firebase'); // Временно отключено

module.exports = async function handler(req, res) {
  try {
    // Временно отключено - требует настройки Firebase
    /*
    const limit = Math.min(parseInt(String(req.query.limit || "20"), 10), 50);
    
    // Читаем последние N по дате (date — поле сортировки)
    const snap = await db.ref("/posts").orderByChild("date").limitToLast(limit).get();
    const list = [];
    
    snap.forEach((c) => list.push(c.val()));
    
    // Новее сверху
    list.sort((a, b) => b.date - a.date);
    
    res.status(200).json({ ok: true, items: list });
    */
    
    // Временный ответ без Firebase
    res.status(200).json({ 
      ok: true, 
      items: [],
      message: "Firebase временно отключен - требуется настройка"
    });
  } catch (e) {
    console.error('❌ Ошибка получения постов:', e);
    res.status(200).json({ ok: false, error: e.message || "unknown" });
  }
};
