# 🔥 Настройка Firebase для раздела "Новости"

## 📋 Что добавлено

✅ **Раздел "Новости"** в главное меню Mini App  
✅ **Автоматическое сохранение** постов из Telegram-канала в Firebase  
✅ **API endpoint** `/api/posts` для получения новостей  
✅ **Стилизованный интерфейс** в стиле проекта  

## 🔧 Настройка Firebase

### 1. Создайте проект в Firebase Console

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Создайте новый проект или выберите существующий
3. Запомните **Project ID**

### 2. Настройте Realtime Database

1. В Firebase Console перейдите в **Realtime Database**
2. Создайте базу данных в тестовом режиме
3. Скопируйте URL базы данных

### 3. Создайте Service Account

1. В Firebase Console перейдите в **Project Settings** → **Service Accounts**
2. Нажмите **"Generate new private key"**
3. Скачайте JSON файл с ключами

### 4. Добавьте переменные окружения в Vercel

В **Vercel Dashboard** → **Project Settings** → **Environment Variables** добавьте:

```
BOT_TOKEN=7530980547:AAFxX3IUtXcz89f9gPEJ778TpCXBiG2ykbA
WEBAPP_URL=https://fitness-bot-miniapp-ged8.vercel.app/
CHANNEL_USERNAME=@your_channel_username
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### 5. Настройте канал в Telegram

1. Создайте канал в Telegram
2. Добавьте бота `@testbotfitness2_bot` как администратора
3. Укажите username канала в `CHANNEL_USERNAME`

## 🚀 Как это работает

### Автоматическое сохранение постов

1. **Бот получает webhook** от Telegram при публикации поста в канале
2. **Проверяется источник** - сохраняются только посты из указанного канала
3. **Данные сохраняются** в Firebase Realtime Database:
   ```json
   {
     "posts": {
       "123": {
         "id": "123",
         "date": 1734950400,
         "text": "Текст поста",
         "entities": [],
         "photos": ["file_id_1", "file_id_2"],
         "has_media": true
       }
     }
   }
   ```

### Отображение в Mini App

1. **Пользователь нажимает** кнопку "НОВОСТИ"
2. **Mini App запрашивает** `/api/posts?limit=20`
3. **API возвращает** последние 20 постов, отсортированных по дате
4. **Интерфейс отображает** карточки с датой, текстом и ссылкой на канал

## 📱 Тестирование

### 1. Опубликуйте пост в канале
```bash
# Проверьте, что пост сохранился
curl -s https://fitness-bot-miniapp-ged8.vercel.app/api/posts
```

### 2. Откройте Mini App
- Найдите бота `@testbotfitness2_bot`
- Нажмите "Открыть фитнес-меню"
- Нажмите кнопку "НОВОСТИ"

### 3. Проверьте логи
В **Vercel Dashboard** → **Functions** → **Logs** должны появиться записи:
```
📝 Пост сохранен в Firebase: 123
```

## 🔍 Структура данных

### Firebase Realtime Database
```
/posts/
  ├── 123/
  │   ├── id: "123"
  │   ├── date: 1734950400
  │   ├── text: "Текст поста"
  │   ├── entities: []
  │   ├── photos: ["file_id_1"]
  │   └── has_media: true
  └── 124/
      └── ...
```

### API Response
```json
{
  "ok": true,
  "items": [
    {
      "id": "124",
      "date": 1734950400,
      "text": "Новый пост",
      "entities": [],
      "photos": [],
      "has_media": false
    }
  ]
}
```

## 🎨 Стили

Раздел "Новости" использует тот же дизайн-систему:
- **Тёмный фон** с оранжевыми акцентами
- **Карточки** с hover-эффектами
- **Типографика** Montserrat + Inter
- **Адаптивный дизайн** для мобильных устройств

## 🚨 Важные моменты

1. **Бот должен быть администратором** канала для получения постов
2. **Firebase ключи** должны быть правильно закодированы в переменных окружения
3. **Канал должен быть публичным** или бот должен иметь доступ к постам
4. **Ограничение на количество** постов: максимум 50 за запрос

## 🔧 Устранение неполадок

### Посты не сохраняются
- Проверьте, что бот администратор канала
- Проверьте переменную `CHANNEL_USERNAME`
- Проверьте логи в Vercel

### API возвращает ошибку
- Проверьте Firebase ключи
- Проверьте права доступа к базе данных
- Проверьте структуру данных в Firebase

### Mini App не загружает новости
- Проверьте CORS настройки
- Проверьте URL API endpoint
- Проверьте консоль браузера на ошибки
