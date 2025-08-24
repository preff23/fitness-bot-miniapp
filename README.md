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
- `CHANNEL_USERNAME` = @fitnesstest
- `CHANNEL_ID` = числовой ID канала (опционально, если не указан - используется CHANNEL_USERNAME)
- `FIREBASE_PROJECT_ID` = ваш_project_id
- `FIREBASE_CLIENT_EMAIL` = ваш_client_email
- `FIREBASE_PRIVATE_KEY` = ваш_private_key
- `FIREBASE_DATABASE_URL` = https://fitness-bot-miniapp-default-rtdb.europe-west1.firebasedatabase.app

### 2. Настройка вебхука
После деплоя выполните команду для установки webhook с поддержкой channel_post и edited_channel_post:

**Через браузер:**
```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<ТВОЙ-ДОМЕН>/api/telegram&allowed_updates=%5B%22message%22,%22channel_post%22,%22edited_channel_post%22%5D
```

**Через cURL:**
```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://<ТВОЙ-ДОМЕН>/api/telegram",
    "allowed_updates": ["message", "channel_post", "edited_channel_post"]
  }'
```

### 3. Проверка вебхука
```
https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo
```

### 4. Получение CHANNEL_ID
Есть несколько способов получить CHANNEL_ID:

1. **Через пересылку**: Переслать пост из канала боту → в апдейте будет `forward_from_chat.id`
2. **Через API**: `https://api.telegram.org/bot<BOT_TOKEN>/getChat?chat_id=@<channel_username>`
3. **Через логи**: Временно логировать `m.chat.id` в `savePost` и сделать тест-пост

### 5. Тестирование системы

#### 5.1. Проверка Firebase подключения
```bash
curl -s https://<твой-домен>/api/test-firebase | jq .
```
Должно вернуться: `{ ok: true, wrote: <ts>, read: { ts: <тот же ts> }, dbURL: "..." }`

#### 5.2. Проверка ENV переменных
```bash
curl -s https://<твой-домен>/api/check-env | jq .
```

#### 5.3. Тестирование webhook
**Правильный cURL-тест (без обёртки "update"):**
```bash
curl -X POST "https://<твой-домен>/api/telegram" \
  -H "Content-Type: application/json" \
  -d '{
    "update_id": 999999,
    "channel_post": {
      "message_id": 200,
      "date": 1756029800,
      "chat": { "id": -1002544629054, "title": "Test", "username": "fitnesstest", "type": "channel" },
      "text": "Тест c правильным CHANNEL_ID"
    }
  }'
```

#### 5.4. Проверка сохранения постов
```bash
curl -s https://<твой-домен>/api/posts | jq .
```
После webhook теста должен показать новый элемент.

#### 5.5. Проверка версии
```bash
curl -s https://<твой-домен>/api/version | jq .
```

## Локальная разработка
```bash
NODE_ENV=development npm start
```

## Примечания
- Бот работает через вебхук на Vercel (serverless)
- Для локальной разработки используется polling
- Telegram не позволяет авто-открыть WebApp без действия пользователя
