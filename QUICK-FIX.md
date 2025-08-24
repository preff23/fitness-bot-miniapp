# 🚨 Быстрое исправление проблемы с ботом

## Проблема
Бот не отвечает на команды `/start` и `/menu` через вебхук на Vercel.

## 🔧 Временное решение (работает сразу)

### 1. Запустите бота локально
```bash
node test-bot.js
```

### 2. Протестируйте в Telegram
- Найдите бота: `@testbotfitness2_bot`
- Отправьте `/start` или `/menu`
- Бот будет отвечать через polling

## 🚀 Постоянное решение (24/7 работа)

### Проблема с Vercel
Серверлесс функции не развертываются автоматически. Нужно:

1. **Откройте Vercel Dashboard**
2. **Перейдите в проект** `fitness-bot-miniapp`
3. **Нажмите "Redeploy"** или "Redeploy Latest"
4. **Дождитесь завершения** деплоя (2-3 минуты)

### Альтернативное решение
Если Vercel не работает, можно использовать:

1. **Railway** - https://railway.app/
2. **Render** - https://render.com/
3. **Heroku** - https://heroku.com/

## 📋 Проверка статуса

### Локальный бот работает:
```bash
node test-bot.js
```

### Проверка вебхука:
```bash
curl -s "https://api.telegram.org/bot8367003356:AAGL4Nr4xAMP5GVPoxTUvyZ6cx9n8JU096c/getWebhookInfo"
```

### Проверка Vercel:
```bash
curl -s https://fitness-bot-miniapp-ged8.vercel.app/api/health
```

## 🎯 Рекомендация

**Для быстрого тестирования:** используйте локальный бот (`node test-bot.js`)

**Для 24/7 работы:** попробуйте пересобрать проект в Vercel Dashboard
