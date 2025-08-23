# Тестирование Fitness Bot

## 🧪 Локальное тестирование (Polling)

### 1. Запуск тестового бота
```bash
node test-bot.js
```

### 2. Проверка в Telegram
- Найдите вашего бота: `@your_bot_username`
- Отправьте команды:
  - `/start` - приветствие с кнопкой "Открыть фитнес-меню"
  - `/menu` - открытие фитнес-меню

### 3. Проверка Mini App
- Нажмите кнопку "Открыть фитнес-меню"
- Должно открыться мини-приложение: https://fitness-bot-miniapp-ged8.vercel.app/

## 🚀 Production тестирование (Webhook)

### 1. Настройка переменных окружения в Vercel
В Project Settings → Environment Variables добавьте:
- `BOT_TOKEN` = 7530980547:AAFxX3IUtXcz89f9gPEJ778TpCXBiG2ykbA
- `WEBAPP_URL` = https://fitness-bot-miniapp-ged8.vercel.app/
- `TG_WEBHOOK_SECRET` = любой рандомный секрет (например, UUID)

### 2. Настройка вебхука
После деплоя выполните в браузере:
```
https://api.telegram.org/bot7530980547:AAFxX3IUtXcz89f9gPEJ778TpCXBiG2ykbA/setWebhook?url=https://fitness-bot-miniapp-ged8.vercel.app/api/telegram&secret_token=YOUR_SECRET
```

### 3. Проверка вебхука
```
https://api.telegram.org/bot7530980547:AAFxX3IUtXcz89f9gPEJ778TpCXBiG2ykbA/getWebhookInfo
```

### 4. Проверка health endpoint
```
https://fitness-bot-miniapp-ged8.vercel.app/api/health
```

## 🔍 Диагностика

### Проверка статуса бота
```bash
curl -s "https://api.telegram.org/bot7530980547:AAFxX3IUtXcz89f9gPEJ778TpCXBiG2ykbA/getMe"
```

### Проверка вебхука
```bash
curl -s "https://api.telegram.org/bot7530980547:AAFxX3IUtXcz89f9gPEJ778TpCXBiG2ykbA/getWebhookInfo"
```

### Проверка Mini App
```bash
curl -s https://fitness-bot-miniapp-ged8.vercel.app/
```

## 📝 Ожидаемое поведение

### Команда /start
- Бот отвечает приветствием
- Показывает кнопку "Открыть фитнес-меню"
- Кнопка открывает Mini App

### Команда /menu
- Бот показывает кнопку "Открыть"
- Кнопка открывает Mini App

### Mini App
- Открывается фитнес-меню с 8 кнопками
- Все кнопки работают и открывают подменю
- Кнопка Telegram в шапке работает

## 🚨 Устранение неполадок

### Бот не отвечает
1. Проверьте токен бота
2. Проверьте, что бот не заблокирован
3. Проверьте логи в Vercel

### Mini App не открывается
1. Проверьте URL в WEBAPP_URL
2. Проверьте, что сайт доступен
3. Проверьте консоль браузера

### Webhook не работает
1. Проверьте переменные окружения в Vercel
2. Проверьте, что серверлесс функции развернулись
3. Проверьте логи в Vercel
