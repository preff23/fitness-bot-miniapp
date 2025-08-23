module.exports = async (req, res) => {
  console.log('📨 Получен запрос от Telegram');
  
  try {
    const { message } = req.body;
    
    if (message && message.text) {
      console.log('💬 Сообщение:', message.text);
      
      if (message.text === '/start') {
        const response = {
          method: 'sendMessage',
          chat_id: message.chat.id,
          text: 'Привет! Я персональный тренер.\nОткрой фитнес-меню:',
          reply_markup: {
            inline_keyboard: [[
              { 
                text: "Открыть фитнес-меню", 
                web_app: { 
                  url: "https://fitness-bot-miniapp-ged8.vercel.app/" 
                } 
              }
            ]]
          }
        };
        
        await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        });
        
        console.log('✅ Ответ отправлен на /start');
      }
      
      if (message.text === '/menu') {
        const response = {
          method: 'sendMessage',
          chat_id: message.chat.id,
          text: 'Открой фитнес-меню:',
          reply_markup: {
            inline_keyboard: [[
              { 
                text: "Открыть", 
                web_app: { 
                  url: "https://fitness-bot-miniapp-ged8.vercel.app/" 
                } 
              }
            ]]
          }
        };
        
        await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        });
        
        console.log('✅ Ответ отправлен на /menu');
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
  
  res.status(200).json({ ok: true });
};
