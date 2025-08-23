# Fitness Bot - Telegram Mini App

## Описание
Telegram бот с Mini App для фитнес-тренера. Включает в себя веб-приложение с меню тренировок и бота для взаимодействия.

## Структура проекта
- `index.html`, `styles.css`, `app.js` - фронтенд Mini App
- `bot.js` - логика Telegram бота
- `photo/` - папка с иконками
- `config.js` - конфигурация

## Настройка бота

### 1. Установка зависимостей
```bash
npm install
```

### 2. Переменные окружения
Создайте файл `.env`:
```
BOT_TOKEN=your_bot_token_here
WEBAPP_URL=https://fitness-bot-miniapp-ged8.vercel.app/
```

### 3. Получение токена бота
1. Напишите @BotFather в Telegram
2. Создайте нового бота: `/newbot`
3. Скопируйте токен в `.env`

### 4. Запуск бота
```bash
npm start
```

## Команды бота
- `/start` - приветственное сообщение с кнопкой "Фитнес меню"
- `/menu` - открытие фитнес-меню через inline кнопку

## Деплой на Vercel (Serverless)

### 1. Переменные окружения в Vercel
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

## Локальная разработка
```bash
NODE_ENV=development npm start
```

## Примечания
- Бот работает через вебхук на Vercel (serverless)
- Для локальной разработки используется polling
- Telegram не позволяет авто-открыть WebApp без действия пользователя
