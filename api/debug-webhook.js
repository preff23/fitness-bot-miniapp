module.exports = async function handler(req, res) {
  try {
    console.log('🔍 Debug webhook - получен запрос:', {
      method: req.method,
      body: req.body,
      hasMessage: !!req.body.message,
      hasChannelPost: !!req.body.channel_post,
      hasEditedChannelPost: !!req.body.edited_channel_post,
      updateId: req.body.update_id,
      timestamp: new Date().toISOString()
    });
    
    // Сохраняем информацию о запросе
    const updateInfo = {
      timestamp: new Date().toISOString(),
      method: req.method,
      updateId: req.body.update_id,
      updateType: req.body.message ? 'message' : 
                  req.body.channel_post ? 'channel_post' : 
                  req.body.edited_channel_post ? 'edited_channel_post' : 'unknown',
      hasChannelPost: !!req.body.channel_post,
      channelUsername: req.body.channel_post?.chat?.username,
      messageId: req.body.channel_post?.message_id,
      text: req.body.channel_post?.text?.substring(0, 50) + '...'
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
