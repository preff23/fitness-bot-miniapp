module.exports = async function handler(req, res) {
  try {
    const channelUsername = process.env.CHANNEL_USERNAME;
    
    res.status(200).json({
      ok: true,
      channelUsername: channelUsername,
      hasChannelUsername: !!channelUsername,
      message: 'Проверка переменной CHANNEL_USERNAME'
    });
  } catch (error) {
    console.error('❌ Ошибка:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};
