# 🚀 Настройка 24/7 работы бота (без локального сервера)

## Цель
Настроить бота так, чтобы он работал 24/7 через Vercel, даже когда ваш ПК выключен.

## 📋 Пошаговая инструкция

### 1. Добавьте переменные окружения в Vercel

1. Откройте https://vercel.com/dashboard
2. Найдите проект `fitness-bot-miniapp`
3. Перейдите в **Settings** → **Environment Variables**
4. Добавьте следующие переменные:

| Name | Value |
|------|-------|
| `BOT_TOKEN` | `8367003356:AAGL4Nr4xAMP5GVPoxTUvyZ6cx9n8JU096c` |
| `WEBAPP_URL` | `https://fitness-bot-miniapp-ged8.vercel.app/` |
| `TG_WEBHOOK_SECRET` | `fitness-bot-secret-2024` |

5. Нажмите **Save**

### 2. Дождитесь развертывания

После добавления переменных окружения Vercel автоматически пересоберет проект. Подождите 1-2 минуты.

### 3. Запустите скрипт настройки вебхука

```bash
node setup-webhook.js
```

### 4. Проверьте работу бота

1. Найдите бота в Telegram: `@testbotfitness2_bot`
2. Отправьте команды:
   - `/start` - приветствие
   - `/menu` - открытие меню

## 🔍 Проверка статуса

### Проверка вебхука
```bash
curl -s "https://api.telegram.org/bot8367003356:AAGL4Nr4xAMP5GVPoxTUvyZ6cx9n8JU096c/getWebhookInfo"
```

### Проверка health endpoint
```bash
curl -s https://fitness-bot-miniapp-ged8.vercel.app/api/health
```

### Проверка статуса бота
```bash
curl -s "https://api.telegram.org/bot8367003356:AAGL4Nr4xAMP5GVPoxTUvyZ6cx9n8JU096c/getMe"
```

## ✅ Ожидаемый результат

После успешной настройки:

1. **Вебхук активен** - бот получает сообщения через Vercel
2. **24/7 доступность** - бот отвечает даже когда ваш ПК выключен
3. **Mini App работает** - кнопки открывают фитнес-меню
4. **Логи доступны** - в Vercel Dashboard → Functions → Logs

## 🚨 Устранение неполадок

### Вебхук не устанавливается
1. Проверьте, что переменные окружения добавлены в Vercel
2. Дождитесь завершения деплоя (1-2 минуты)
3. Проверьте health endpoint: `https://fitness-bot-miniapp-ged8.vercel.app/api/health`

### Бот не отвечает
1. Проверьте статус вебхука: `getWebhookInfo`
2. Проверьте логи в Vercel Dashboard
3. Убедитесь, что токен бота правильный

### Mini App не открывается
1. Проверьте URL в переменной `WEBAPP_URL`
2. Убедитесь, что сайт доступен: `https://fitness-bot-miniapp-ged8.vercel.app/`

## 🎯 Результат

После выполнения всех шагов ваш бот будет работать 24/7 через Vercel, независимо от состояния вашего ПК!
