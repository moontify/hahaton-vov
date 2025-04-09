/**
 * Скрипт для настройки вебхука Telegram бота
 * Запустите этот скрипт один раз после деплоя на Vercel чтобы настроить вебхук
 * 
 * Использование:
 * node src/lib/telegramSetup.js <URL_ВАШЕГО_САЙТА> <TELEGRAM_BOT_TOKEN>
 * Пример: node src/lib/telegramSetup.js https://your-site.vercel.app 123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ
 */

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Необходимо указать URL сайта и токен бота');
  console.error('Использование: node telegramSetup.js <URL_САЙТА> <TELEGRAM_BOT_TOKEN>');
  process.exit(1);
}

const baseUrl = args[0].endsWith('/') ? args[0].slice(0, -1) : args[0];
const botToken = args[1];
const webhookUrl = `${baseUrl}/api/telegram/webhook`;

async function setupWebhook() {
  try {
    // Проверяем текущий статус вебхука
    console.log('Получение текущей информации о вебхуке...');
    const infoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    const infoData = await infoResponse.json();
    
    console.log('Текущий статус вебхука:');
    console.log(JSON.stringify(infoData, null, 2));
    
    if (infoData.result && infoData.result.url === webhookUrl) {
      console.log('Вебхук уже настроен на правильный URL. Обновляем настройки...');
    } else {
      console.log(`Устанавливаем новый вебхук: ${webhookUrl}`);
    }
    
    // Устанавливаем вебхук с оптимальными настройками
    const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message", "callback_query", "inline_query"],
        drop_pending_updates: true, // Опционально: сбросить все ожидающие обновления
        secret_token: "SecretTokenForWebhook", // Рекомендуется установить секретный токен для дополнительной безопасности
        max_connections: 100 // Максимальное количество одновременных соединений
      }),
    });
    
    const data = await response.json();
    
    if (data.ok) {
      console.log('✅ Вебхук успешно установлен!');
      
      // Получаем обновленную информацию о вебхуке для проверки
      const newInfoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
      const newInfoData = await newInfoResponse.json();
      
      console.log('Обновленный статус вебхука:');
      console.log(JSON.stringify(newInfoData, null, 2));
      
      // Проверяем информацию о боте
      const botInfoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const botInfoData = await botInfoResponse.json();
      
      if (botInfoData.ok) {
        console.log('\nИнформация о боте:');
        console.log(`Имя: ${botInfoData.result.first_name}`);
        console.log(`Логин: @${botInfoData.result.username}`);
        console.log(`ID: ${botInfoData.result.id}`);
      }
    } else {
      console.error('❌ Ошибка при установке вебхука:', data.description);
    }
  } catch (error) {
    console.error('❌ Произошла ошибка:', error);
  }
}

// Запускаем настройку
setupWebhook();

// Вывод дополнительных рекомендаций
console.log('\n📝 Рекомендации:');
console.log('1. Убедитесь, что в переменных окружения вашего проекта на Vercel настроены:');
console.log('   - TELEGRAM_BOT_TOKEN: Токен вашего бота');
console.log('   - TELEGRAM_CHAT_ID: ID чата для административных уведомлений');
console.log('   - API_KEY: Уникальный ключ для авторизации запросов к API');
console.log('2. Настройте cron-задачу в vercel.json для пинга вашего вебхука каждые 5 минут');
console.log('3. Увеличьте timeout для функций в vercel.json, если бот работает медленно');
console.log('4. Для тестирования вебхука отправьте сообщение боту в Telegram'); 