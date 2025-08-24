module.exports = async function handler(req, res) {
  try {
    console.log('🔍 Debug webhook - получен запрос:', {
      method: req.method,
      body: req.body || {},
      hasMessage: !!(req.body && req.body.message),
      hasChannelPost: !!(req.body && req.body.channel_post),
      hasEditedChannelPost: !!(req.body && req.body.edited_channel_post),
      updateId: req.body && req.body.update_id,
      timestamp: new Date().toISOString()
    });
    
    // Сохраняем информацию о запросе
    const updateInfo = {
      timestamp: new Date().toISOString(),
      method: req.method,
      updateId: req.body.update_id,
      updateType: (req.body && req.body.message) ? 'message' : 
                  (req.body && req.body.channel_post) ? 'channel_post' : 
                  (req.body && req.body.edited_channel_post) ? 'edited_channel_post' : 'unknown',
      hasChannelPost: !!(req.body && req.body.channel_post),
      channelUsername: req.body && req.body.channel_post && req.body.channel_post.chat && req.body.channel_post.chat.username,
      messageId: req.body && req.body.channel_post && req.body.channel_post.message_id,
      text: req.body && req.body.channel_post && req.body.channel_post.text ? req.body.channel_post.text.substring(0, 50) + '...' : 'no text'
    };
    
    res.status(200).json({
      ok: true,
      message: 'Webhook debug получен',
      updateInfo: updateInfo
    });
  } catch (error) {
    console.error('❌ Ошибка в debug webhook:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};
