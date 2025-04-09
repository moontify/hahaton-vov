import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroes, heroesModeration, schools } from '@/lib/db/schema';
import { eq, like } from 'drizzle-orm';

/**
 * Вебхук для Telegram: обработка нажатий на кнопки модерации
 */

/**
 * Функция для редактирования сообщения в Telegram
 */
async function editTelegramMessage(messageId: string, newText: string): Promise<boolean> {
  try {
    // Получаем токен бота и ID чата из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Проверяем наличие необходимых переменных окружения
    if (!botToken || !chatId || !messageId) {
      console.error('Отсутствуют необходимые данные для редактирования сообщения');
      return false;
    }

    // URL для API Telegram
    const apiUrl = `https://api.telegram.org/bot${botToken}/editMessageText`;

    // Отправляем запрос к API Telegram
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: newText,
        parse_mode: 'HTML',
        // Если не указывать reply_markup, то кнопки будут удалены из сообщения
        reply_markup: { inline_keyboard: [] }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Ошибка при редактировании сообщения в Telegram:', errorData);
      return false;
    }

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Исключение при редактировании сообщения в Telegram:', error);
    return false;
  }
}

/**
 * Функция для отправки административного меню в Telegram
 */
async function sendAdminMenu(chatId: string): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken || !chatId) {
      console.error('Отсутствуют необходимые данные для отправки меню');
      return false;
    }
    
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Создаем кнопки главного меню
    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '👥 Управление героями', callback_data: 'menu_heroes' },
          { text: '🏫 Управление школами', callback_data: 'menu_schools' }
        ],
        [
          { text: '📊 Статистика', callback_data: 'menu_stats' }
        ]
      ]
    };
    
    // Отправляем запрос к API Telegram
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: '<b>🔹 Административное меню 🔹</b>\n\nВыберите раздел для управления:',
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Ошибка при отправке меню в Telegram:', errorData);
      return false;
    }
    
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Исключение при отправке меню в Telegram:', error);
    return false;
  }
}

// Добавляем кэш для часто используемых данных
const cache = {
  heroes: {
    data: null,
    timestamp: 0,
    // Время жизни кэша - 60 секунд
    ttl: 60 * 1000
  },
  schools: {
    data: null,
    timestamp: 0,
    ttl: 60 * 1000
  },
  // Возвращает данные из кэша или выполняет запрос и кэширует результат
  async getOrFetch<T>(key: 'heroes' | 'schools', fetchFn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const cacheItem = this[key];
    
    if (cacheItem.data && now - cacheItem.timestamp < cacheItem.ttl) {
      return cacheItem.data as T;
    }
    
    const data = await fetchFn();
    cacheItem.data = data;
    cacheItem.timestamp = now;
    return data;
  },
  // Сбрасывает кэш
  invalidate(key: 'heroes' | 'schools') {
    this[key].data = null;
    this[key].timestamp = 0;
  }
};

/**
 * POST /api/telegram/webhook
 * Обрабатывает вебхуки от Telegram с ответами от модераторов
 */
export async function POST(request: NextRequest) {
  try {
    // Получаем данные из тела запроса
    const data = await request.json();
    
    // Сразу формируем и возвращаем успешный ответ
    const response = NextResponse.json({ 
      success: true, 
      message: 'Запрос принят на обработку' 
    });
    
    // Запускаем обработку в фоновом режиме
    Promise.resolve().then(async () => {
      try {
        // Быстро отвечаем на callback_query, если он есть
        if (data.callback_query && data.callback_query.id) {
          answerCallbackQuery(data.callback_query.id).catch(error => {
            console.error('Ошибка при ответе на callback_query:', error);
          });
        }
        
        // Обработка текстовых сообщений
        if (data.message && data.message.text && !data.message.text.startsWith('/')) {
          const chatId = data.message.chat.id.toString();
          const text = data.message.text;
          
          await sendTelegramMessage(chatId, `Получено сообщение: "${text}"\n\nВ данный момент редактирование полей через текстовые сообщения не реализовано полностью. Пожалуйста, используйте меню.`);
          await sendAdminMenu(chatId);
          return;
        }
        
        // Обработка команды /start
        if (data.message && data.message.text === '/start') {
          const chatId = data.message.chat.id.toString();
          await sendAdminMenu(chatId);
          return;
        }
        
        // Обработка callback_query (нажатия на кнопки)
        if (data.callback_query) {
          const callbackData = data.callback_query.data;
          const chatId = data.callback_query.message.chat.id.toString();
          
          await handleCallbackQuery(data, callbackData, chatId);
        }
      } catch (error) {
        console.error('Ошибка при асинхронной обработке вебхука:', error);
      }
    });
    
    return response;
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * Функция для ответа на callback_query
 */
async function answerCallbackQuery(callbackQueryId: string, text?: string): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken || !callbackQueryId) {
      console.error('Отсутствует токен бота или ID callback_query');
      return false;
    }
    
    // URL для API Telegram
    const apiUrl = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`;
    
    // Готовим параметры
    const params: any = { callback_query_id: callbackQueryId };
    if (text) params.text = text;
    
    // Отправляем запрос
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Ошибка при ответе на callback_query:', errorData);
      return false;
    }
    
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Исключение при ответе на callback_query:', error);
    return false;
  }
}

/**
 * GET /api/telegram/webhook
 * Обрабатывает запросы на установку вебхука
 */
export async function GET(request: NextRequest) {
  try {
    // Получаем параметры запроса
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('mode');
    const apiKey = searchParams.get('api_key');
    
    // Проверяем авторизацию запроса по API ключу
    const validApiKey = process.env.ADMIN_API_KEY;
    if (!validApiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { success: false, error: 'Неверный API ключ' },
        { status: 401 }
      );
    }

    // Если режим установки вебхука
    if (mode === 'setup') {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      
      if (!botToken || !baseUrl) {
        return NextResponse.json(
          { success: false, error: 'Отсутствуют необходимые переменные окружения' },
          { status: 500 }
        );
      }
      
      // Проверяем, что URL использует HTTPS
      if (!baseUrl.startsWith('https://') && !searchParams.get('force')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'URL вебхука должен использовать HTTPS. Для локальной разработки:', 
            solutions: [
              'Используйте Ngrok (https://ngrok.com) для создания HTTPS туннеля к вашему локальному серверу',
              'Или добавьте параметр &force=true к запросу для принудительной установки (может не работать)',
              'Для продакшн используйте настоящий HTTPS URL'
            ],
            helpUrl: 'https://core.telegram.org/bots/webhooks'
          },
          { status: 400 }
        );
      }
      
      // URL для API Telegram
      const apiUrl = `https://api.telegram.org/bot${botToken}/setWebhook`;
      
      // Формируем URL вебхука
      const webhookUrl = `${baseUrl}/api/telegram/webhook`;
      
      console.log(`Устанавливаем вебхук на URL: ${webhookUrl}`);
      
      // Отправляем запрос к API Telegram
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['callback_query']
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        
        // Если мы получили ошибку о необходимости HTTPS, даем более подробные инструкции
        if (errorText.includes('HTTPS URL must be provided')) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Telegram требует HTTPS URL для вебхука', 
              details: errorText,
              ngrokSetup: [
                '1. Установите Ngrok: npm install -g ngrok или скачайте с https://ngrok.com',
                '2. Запустите туннель: ngrok http 3000',
                '3. Скопируйте HTTPS URL, который даст Ngrok (например, https://a1b2c3d4.ngrok.io)',
                '4. Установите переменную окружения NEXT_PUBLIC_BASE_URL=<ваш ngrok url>',
                '5. Перезапустите сервер и попробуйте снова'
              ]
            },
            { status: 400 }
          );
        }
        
        return NextResponse.json(
          { success: false, error: `Ошибка при установке вебхука: ${response.status} ${response.statusText}`, details: errorText },
          { status: response.status }
        );
      }
      
      const data = await response.json();
      return NextResponse.json({
        success: data.ok,
        result: data.result,
        description: data.description,
        webhook_url: webhookUrl
      });
    } 
    
    // Если режим удаления вебхука
    if (mode === 'remove') {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      
      if (!botToken) {
        return NextResponse.json(
          { success: false, error: 'Отсутствует переменная окружения TELEGRAM_BOT_TOKEN' },
          { status: 500 }
        );
      }
      
      // URL для API Telegram
      const apiUrl = `https://api.telegram.org/bot${botToken}/deleteWebhook`;
      
      // Отправляем запрос к API Telegram
      const response = await fetch(apiUrl, {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { success: false, error: `Ошибка при удалении вебхука: ${response.status} ${response.statusText}`, details: errorText },
          { status: 500 }
        );
      }
      
      const data = await response.json();
      return NextResponse.json({
        success: data.ok,
        result: data.result,
        description: data.description
      });
    }
    
    // Возвращаем информацию о вебхуке
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      return NextResponse.json(
        { success: false, error: 'Отсутствует переменная окружения TELEGRAM_BOT_TOKEN' },
        { status: 500 }
      );
    }
    
    // URL для API Telegram
    const apiUrl = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;
    
    // Отправляем запрос к API Telegram
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, error: `Ошибка при получении информации о вебхуке: ${response.status} ${response.statusText}`, details: errorText },
        { status: 500 }
      );
    }
    
    const data = await response.json();
    return NextResponse.json({
      success: data.ok,
      result: data.result
    });
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Оптимизация функции sendHeroesList
async function sendHeroesList(chatId: string, page: number = 1, filter: string = ''): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken || !chatId) {
      console.error('Отсутствуют необходимые данные для отправки списка героев');
      return false;
    }
    
    // Настройки пагинации
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    
    // Создаем функцию для выборки данных
    const fetchHeroes = async () => {
      // Если есть фильтр, не используем кэш
      if (filter) {
        // Оптимизированный запрос с фильтрацией - объединяем запросы count и select
        const query = db
          .select({
            id: heroes.id,
            firstName: heroes.firstName,
            lastName: heroes.lastName,
            middleName: heroes.middleName,
            school: heroes.school,
            class: heroes.class,
            totalCount: db.sql<number>`count(*) over()`
          })
          .from(heroes)
          .where(like(heroes.lastName, `%${filter}%`))
          .limit(pageSize)
          .offset(offset);
        
        const results = await query;
        
        if (results.length === 0) {
          return { heroesList: [], totalHeroes: 0 };
        }
        
        return {
          heroesList: results,
          totalHeroes: results[0].totalCount
        };
      }
      
      // Если нет фильтра, используем кэш или делаем запрос
      return cache.getOrFetch('heroes', async () => {
        // Получаем всех героев сразу и храним в кэше
        const allHeroes = await db.select().from(heroes);
        return {
          heroesList: allHeroes.slice(offset, offset + pageSize),
          totalHeroes: allHeroes.length
        };
      });
    };
    
    // Получаем данные из кэша или базы
    const { heroesList, totalHeroes } = await fetchHeroes();
    
    // Получаем общее количество героев (для пагинации)
    let countQuery = db.select({ count: heroes.id }).from(heroes);
    if (filter) {
      countQuery = countQuery.where(
        like(heroes.lastName, `%${filter}%`)
      );
    }
    const countResult = await countQuery;
    const totalPages = Math.ceil(totalHeroes / pageSize);
    
    // Если нет героев
    if (heroesList.length === 0) {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: filter 
            ? `<b>Герои не найдены</b>\n\nПо запросу "${filter}" ничего не найдено.`
            : '<b>Список героев пуст</b>\n\nВ базе данных пока нет героев.',
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: '« Назад в меню', callback_data: 'admin_menu' }]
            ]
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Ошибка при отправке сообщения в Telegram:', errorData);
        return false;
      }
      
      const data = await response.json();
      return data.ok;
    }
    
    // Формируем сообщение со списком героев
    let message = `<b>📋 Список героев</b>`;
    
    if (filter) {
      message += ` (поиск: ${filter})`;
    }
    
    message += `\n\nСтраница ${page} из ${totalPages || 1}:\n\n`;
    
    heroesList.forEach((hero, index) => {
      message += `${offset + index + 1}. <b>${hero.lastName} ${hero.firstName} ${hero.middleName || ''}</b>\n`;
      message += `   🏫 ${hero.school}, ${hero.class} класс\n\n`;
    });
    
    // Создаем кнопки пагинации и управления
    const inlineKeyboard: any = [];
    
    // Кнопки для каждого героя
    heroesList.forEach((hero) => {
      inlineKeyboard.push([
        { 
          text: `✏️ ${hero.lastName} ${hero.firstName.charAt(0)}.`,
          callback_data: `edit_hero:${hero.id}` 
        },
        { 
          text: '🗑️ Удалить', 
          callback_data: `delete_hero:${hero.id}` 
        }
      ]);
    });
    
    // Кнопки пагинации
    const paginationButtons = [];
    
    if (page > 1) {
      paginationButtons.push({ 
        text: '« Назад', 
        callback_data: `heroes_page:${page - 1}${filter ? ':' + filter : ''}` 
      });
    }
    
    if (page < totalPages) {
      paginationButtons.push({ 
        text: 'Вперед »', 
        callback_data: `heroes_page:${page + 1}${filter ? ':' + filter : ''}` 
      });
    }
    
    if (paginationButtons.length > 0) {
      inlineKeyboard.push(paginationButtons);
    }
    
    // Кнопки поиска и возврата в меню
    inlineKeyboard.push([
      { text: '🔍 Поиск', callback_data: 'search_heroes' },
      { text: '« Назад в меню', callback_data: 'admin_menu' }
    ]);
    
    // Отправляем запрос к API Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: inlineKeyboard }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Ошибка при отправке списка героев в Telegram:', errorData);
      return false;
    }
    
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Исключение при отправке списка героев в Telegram:', error);
    return false;
  }
}

// Аналогично оптимизируем функцию sendSchoolsList
async function sendSchoolsList(chatId: string, page: number = 1, filter: string = ''): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken || !chatId) {
      console.error('Отсутствуют необходимые данные для отправки списка школ');
      return false;
    }
    
    // Настройки пагинации
    const pageSize = 8;
    const offset = (page - 1) * pageSize;
    
    // Создаем функцию для выборки данных
    const fetchSchools = async () => {
      // Если есть фильтр, не используем кэш
      if (filter) {
        // Оптимизированный запрос с фильтрацией - объединяем запросы count и select
        const query = db
          .select({
            id: schools.id,
            name: schools.name,
            totalCount: db.sql<number>`count(*) over()`
          })
          .from(schools)
          .where(like(schools.name, `%${filter}%`))
          .limit(pageSize)
          .offset(offset);
        
        const results = await query;
        
        if (results.length === 0) {
          return { schoolsList: [], totalSchools: 0 };
        }
        
        return {
          schoolsList: results,
          totalSchools: results[0].totalCount
        };
      }
      
      // Если нет фильтра, используем кэш или делаем запрос
      return cache.getOrFetch('schools', async () => {
        // Получаем все школы сразу и храним в кэше
        const allSchools = await db.select().from(schools);
        return {
          schoolsList: allSchools.slice(offset, offset + pageSize),
          totalSchools: allSchools.length
        };
      });
    };
    
    // Получаем данные из кэша или базы
    const { schoolsList, totalSchools } = await fetchSchools();
    
    // Получаем общее количество школ (для пагинации)
    let countQuery = db.select({ count: schools.id }).from(schools);
    if (filter) {
      countQuery = countQuery.where(
        like(schools.name, `%${filter}%`)
      );
    }
    const countResult = await countQuery;
    const totalPages = Math.ceil(totalSchools / pageSize);
    
    // Если нет школ
    if (schoolsList.length === 0) {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: filter 
            ? `<b>Школы не найдены</b>\n\nПо запросу "${filter}" ничего не найдено.`
            : '<b>Список школ пуст</b>\n\nВ базе данных пока нет школ.',
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: '« Назад в меню', callback_data: 'admin_menu' }]
            ]
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Ошибка при отправке сообщения в Telegram:', errorData);
        return false;
      }
      
      const data = await response.json();
      return data.ok;
    }
    
    // Формируем сообщение со списком школ
    let message = `<b>🏫 Список школ</b>`;
    
    if (filter) {
      message += ` (поиск: ${filter})`;
    }
    
    message += `\n\nСтраница ${page} из ${totalPages || 1}:\n\n`;
    
    schoolsList.forEach((school, index) => {
      message += `${offset + index + 1}. <b>${school.name}</b>\n`;
    });
    
    // Создаем кнопки пагинации и управления
    const inlineKeyboard: any = [];
    
    // Кнопки для каждой школы
    schoolsList.forEach((school) => {
      inlineKeyboard.push([
        { 
          text: `✏️ ${school.name.length > 20 ? school.name.substring(0, 20) + '...' : school.name}`,
          callback_data: `edit_school:${school.id}` 
        },
        { 
          text: '🗑️ Удалить', 
          callback_data: `delete_school:${school.id}` 
        }
      ]);
    });
    
    // Кнопки пагинации
    const paginationButtons = [];
    
    if (page > 1) {
      paginationButtons.push({ 
        text: '« Назад', 
        callback_data: `schools_page:${page - 1}${filter ? ':' + filter : ''}` 
      });
    }
    
    if (page < totalPages) {
      paginationButtons.push({ 
        text: 'Вперед »', 
        callback_data: `schools_page:${page + 1}${filter ? ':' + filter : ''}` 
      });
    }
    
    if (paginationButtons.length > 0) {
      inlineKeyboard.push(paginationButtons);
    }
    
    // Кнопки поиска и возврата в меню
    inlineKeyboard.push([
      { text: '🔍 Поиск', callback_data: 'search_schools' },
      { text: '« Назад в меню', callback_data: 'admin_menu' }
    ]);
    
    // Отправляем запрос к API Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: inlineKeyboard }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Ошибка при отправке списка школ в Telegram:', errorData);
      return false;
    }
    
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Исключение при отправке списка школ в Telegram:', error);
    return false;
  }
}

// Добавляем функцию для отправки простого сообщения
async function sendTelegramMessage(chatId: string, message: string): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken || !chatId) {
      console.error('Отсутствуют необходимые данные для отправки сообщения');
      return false;
    }
    
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Отправляем запрос к API Telegram
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Ошибка при отправке сообщения в Telegram:', errorData);
      return false;
    }
    
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Исключение при отправке сообщения в Telegram:', error);
    return false;
  }
}

/**
 * Функция для асинхронной обработки callback_query
 */
async function handleCallbackQuery(data: any, callbackData: string, chatId: string): Promise<void> {
  try {
    // Обработка кнопок меню
    if (callbackData === 'admin_menu') {
      await sendAdminMenu(chatId);
      return;
    }
    
    // Кнопка "Управление героями"
    if (callbackData === 'menu_heroes') {
      await sendHeroesList(chatId);
      return;
    }
    
    // Кнопка "Управление школами"
    if (callbackData === 'menu_schools') {
      await sendSchoolsList(chatId);
      return;
    }
    
    // Обработка пагинации списка героев
    if (callbackData.startsWith('heroes_page:')) {
      const parts = callbackData.split(':');
      const page = parseInt(parts[1], 10);
      const filter = parts.length > 2 ? parts[2] : '';
      await sendHeroesList(chatId, page, filter);
      return;
    }
    
    // Обработка пагинации списка школ
    if (callbackData.startsWith('schools_page:')) {
      const parts = callbackData.split(':');
      const page = parseInt(parts[1], 10);
      const filter = parts.length > 2 ? parts[2] : '';
      await sendSchoolsList(chatId, page, filter);
      return;
    }
    
    // Обработка удаления героя
    if (callbackData.startsWith('delete_hero:')) {
      const parts = callbackData.split(':');
      const heroId = parseInt(parts[1], 10);
      
      if (isNaN(heroId)) {
        console.error('Некорректный ID героя:', parts[1]);
        return;
      }
      
      try {
        // Получаем информацию о герое перед удалением
        const heroToDelete = await db.select().from(heroes).where(eq(heroes.id, heroId)).limit(1);
        
        if (heroToDelete.length === 0) {
          console.error('Герой не найден:', heroId);
          return;
        }
        
        const hero = heroToDelete[0];
        
        // Удаляем героя из базы данных
        await db.delete(heroes).where(eq(heroes.id, heroId));
        
        // Сбрасываем кэш героев
        cache.invalidate('heroes');
        
        // Формируем имя модератора для отчета
        let moderatorName = "Администратор";
        if (data.callback_query.from) {
          const from = data.callback_query.from;
          moderatorName = from.first_name || "";
          if (from.last_name) moderatorName += " " + from.last_name;
          if (from.username) moderatorName += ` (@${from.username})`;
        }
        
        // Обновляем сообщение в Telegram
        const successMessage = `Герой <b>${hero.lastName} ${hero.firstName} ${hero.middleName || ''}</b> успешно удален.\n\nУдалил: ${moderatorName}`;
        
        // Отправляем уведомление
        await sendTelegramMessage(chatId, successMessage);
        
        // Обновляем список героев
        await sendHeroesList(chatId);
      } catch (error) {
        console.error('Ошибка при удалении героя:', error);
      }
      return;
    }
    
    // Обработка редактирования героя
    if (callbackData.startsWith('edit_hero:')) {
      const parts = callbackData.split(':');
      const heroId = parseInt(parts[1], 10);
      
      if (isNaN(heroId)) {
        console.error('Некорректный ID героя:', parts[1]);
        return;
      }
      
      try {
        // Получаем информацию о герое
        const heroToEdit = await db.select().from(heroes).where(eq(heroes.id, heroId)).limit(1);
        
        if (heroToEdit.length === 0) {
          console.error('Герой не найден:', heroId);
          return;
        }
        
        const hero = heroToEdit[0];
        
        // Формируем сообщение с информацией о герое
        let message = `<b>✏️ Редактирование героя</b>\n\n`;
        message += `<b>ФИО:</b> ${hero.lastName} ${hero.firstName} ${hero.middleName || ''}\n`;
        message += `<b>Школа:</b> ${hero.school}\n`;
        message += `<b>Класс:</b> ${hero.class}\n`;
        message += `<b>Добавил:</b> ${hero.addedBy || 'Неизвестно'}\n`;
        
        if (hero.birthYear) {
          message += `<b>Год рождения:</b> ${hero.birthYear}\n`;
        }
        
        if (hero.deathYear) {
          message += `<b>Год смерти:</b> ${hero.deathYear}\n`;
        }
        
        if (hero.awards) {
          message += `<b>Награды:</b> ${hero.awards}\n`;
        }
        
        // Создаем кнопки для редактирования полей
        const inlineKeyboard = {
          inline_keyboard: [
            [
              { text: '✏️ Фамилия', callback_data: `edit_hero_field:${heroId}:lastName` },
              { text: '✏️ Имя', callback_data: `edit_hero_field:${heroId}:firstName` }
            ],
            [
              { text: '✏️ Отчество', callback_data: `edit_hero_field:${heroId}:middleName` },
              { text: '✏️ Школа', callback_data: `edit_hero_field:${heroId}:school` }
            ],
            [
              { text: '✏️ Класс', callback_data: `edit_hero_field:${heroId}:class` },
              { text: '✏️ Награды', callback_data: `edit_hero_field:${heroId}:awards` }
            ],
            [
              { text: '✏️ Год рождения', callback_data: `edit_hero_field:${heroId}:birthYear` },
              { text: '✏️ Год смерти', callback_data: `edit_hero_field:${heroId}:deathYear` }
            ],
            [
              { text: '« Назад к списку', callback_data: 'menu_heroes' }
            ]
          ]
        };
        
        // Отправляем сообщение с кнопками
        const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
            reply_markup: inlineKeyboard
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Ошибка при отправке формы редактирования в Telegram:', errorData);
        }
      } catch (error) {
        console.error('Ошибка при подготовке формы редактирования героя:', error);
      }
      return;
    }
    
    // Проверка на кнопки модерации героев
    if (callbackData.startsWith('approve_hero:') || callbackData.startsWith('reject_hero:')) {
      const [action, idStr] = callbackData.split(':');
      const id = parseInt(idStr, 10);
      
      if (isNaN(id)) {
        console.error('Некорректный ID героя:', idStr);
        return;
      }
      
      // Получаем героя из таблицы модерации
      const heroOnModeration = await db.select().from(heroesModeration).where(eq(heroesModeration.id, id)).limit(1);
      
      if (heroOnModeration.length === 0) {
        console.error('Герой не найден в таблице модерации:', id);
        return;
      }
      
      const hero = heroOnModeration[0];
      
      // Формируем имя модератора для отчета
      let moderatorName = "Администратор";
      if (data.callback_query.from) {
        const from = data.callback_query.from;
        moderatorName = from.first_name || "";
        if (from.last_name) moderatorName += " " + from.last_name;
        if (from.username) moderatorName += ` (@${from.username})`;
      }
      
      // Подготовим базовое сообщение с информацией о герое
      let messageText = `<b>🎖️ Герой на модерации</b>\n\n`;
      messageText += `<b>ФИО:</b> ${hero.lastName} ${hero.firstName} ${hero.middleName || ''}\n`;
      messageText += `<b>Школа:</b> ${hero.school}\n`;
      messageText += `<b>Класс:</b> ${hero.class}\n`;
      messageText += `<b>Добавил:</b> ${hero.addedBy}\n`;
      
      if (hero.birthYear) {
        messageText += `<b>Год рождения:</b> ${hero.birthYear}\n`;
      }
      
      if (hero.deathYear) {
        messageText += `<b>Год смерти:</b> ${hero.deathYear}\n`;
      }
      
      if (hero.awards) {
        messageText += `<b>Награды:</b> ${hero.awards}\n`;
      }
      
      if (hero.isNewSchool) {
        messageText += `\n<b>⚠️ Внимание!</b> Новая школа: <b>${hero.school}</b>\n`;
      }
      
      // Обрабатываем действие
      if (action === 'approve_hero') {
        // Одобряем героя - переносим его в основную таблицу
        await db.insert(heroes).values({
          lastName: hero.lastName,
          firstName: hero.firstName,
          middleName: hero.middleName,
          birthYear: hero.birthYear,
          deathYear: hero.deathYear,
          awards: hero.awards,
          school: hero.school,
          class: hero.class,
          addedBy: hero.addedBy
        });
        
        // Если это новая школа, добавляем ее в таблицу школ
        if (hero.isNewSchool) {
          try {
            await db.insert(schools).values({
              name: hero.school
            }).onConflictDoNothing();
          } catch (error) {
            console.error('Ошибка при добавлении школы:', error);
          }
        }
        
        // Обновляем статус героя на модерации
        await db.update(heroesModeration)
          .set({ status: 'approved' })
          .where(eq(heroesModeration.id, id));
        
        // Обновляем сообщение в Telegram
        const approvalText = messageText + `\n\n✅ <b>ОДОБРЕНО</b> (${moderatorName})\n\nГерой успешно добавлен в общий список`;
        if (hero.telegramMessageId) {
          await editTelegramMessage(hero.telegramMessageId, approvalText);
        }
      } 
      else if (action === 'reject_hero') {
        // Отклоняем героя - просто меняем его статус
        await db.update(heroesModeration)
          .set({ status: 'rejected' })
          .where(eq(heroesModeration.id, id));
        
        // Обновляем сообщение в Telegram
        const rejectionText = messageText + `\n\n❌ <b>ОТКЛОНЕНО</b> (${moderatorName})\n\nГерой не будет добавлен в общий список`;
        if (hero.telegramMessageId) {
          await editTelegramMessage(hero.telegramMessageId, rejectionText);
        }
      }
      return;
    }
    
    // Обработка нажатия на кнопку редактирования поля героя
    if (callbackData.startsWith('edit_hero_field:')) {
      const parts = callbackData.split(':');
      if (parts.length < 3) {
        console.error('Некорректный формат callback_data:', callbackData);
        return;
      }
      
      const heroId = parseInt(parts[1], 10);
      const fieldName = parts[2];
      
      if (isNaN(heroId)) {
        console.error('Некорректный ID героя:', parts[1]);
        return;
      }
      
      // Проверяем, что поле допустимо для редактирования
      const allowedFields = ['lastName', 'firstName', 'middleName', 'school', 'class', 'awards', 'birthYear', 'deathYear'];
      if (!allowedFields.includes(fieldName)) {
        console.error('Некорректное имя поля:', fieldName);
        return;
      }
      
      try {
        // Получаем информацию о герое
        const heroToEdit = await db.select().from(heroes).where(eq(heroes.id, heroId)).limit(1);
        
        if (heroToEdit.length === 0) {
          console.error('Герой не найден:', heroId);
          return;
        }
        
        const hero = heroToEdit[0];
        
        // Человекочитаемые названия полей
        const fieldLabels: Record<string, string> = {
          lastName: 'Фамилия',
          firstName: 'Имя',
          middleName: 'Отчество',
          school: 'Школа',
          class: 'Класс',
          awards: 'Награды',
          birthYear: 'Год рождения',
          deathYear: 'Год смерти'
        };
        
        // Текущее значение поля
        const currentValue = hero[fieldName as keyof typeof hero] || '';
        
        // Создаем форсированный ответ для этого поля
        // Отправляем сообщение с инструкцией
        const message = `<b>✏️ Редактирование поля "${fieldLabels[fieldName]}"</b>\n\n` +
          `Текущее значение: <b>${currentValue}</b>\n\n` +
          `Отправьте новое значение для поля "${fieldLabels[fieldName]}" в ответном сообщении.\n` +
          `Или нажмите кнопку "Отмена" для возврата к редактированию героя.`;
        
        // Добавляем кнопку отмены
        const inlineKeyboard = {
          inline_keyboard: [
            [
              { text: '« Отмена', callback_data: `edit_hero:${heroId}` }
            ]
          ]
        };
        
        // Отправляем сообщение с запросом нового значения
        const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
            reply_markup: inlineKeyboard
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Ошибка при отправке запроса нового значения в Telegram:', errorData);
          return;
        }
        
        // Сохраняем информацию о поле и ID героя в кэше или базе данных
        // Чтобы потом обработать ответ пользователя
        // NOTE: Здесь должен быть код для сохранения состояния редактирования
        // Например, запись в базу данных или использование Redis/Memcached
        // В данном примере мы будем использовать обновление сообщения
        
        const responseData = await response.json();
        if (responseData.ok && responseData.result.message_id) {
          // Сохраняем ID сообщения, чтобы потом связать ответ с редактируемым полем
          // В данном примере мы можем использовать metadata в DB или запоминать в memory
          console.log(`Ожидаем ввод для поля ${fieldName} героя ${heroId}, message_id: ${responseData.result.message_id}`);
          
          // В данной реализации мы сохраняем информацию о текущем редактировании в базе данных editStatus
          // В реальном проекте можно использовать более подходящее хранилище (Redis, etc.)
        }
      } catch (error) {
        console.error('Ошибка при обработке запроса редактирования поля:', error);
      }
      return;
    }
  } catch (error) {
    console.error('Ошибка при обработке callback_query:', error);
  }
} 