import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroes, schools } from '@/lib/db/schema';
import { eq, like } from 'drizzle-orm';

/**
 * API для отправки сообщений в Telegram
 * Используется для отправки уведомлений администраторам о новых героях и школах
 */

// Функция для отправки административного меню в Telegram
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

// Функция для отправки списка героев с кнопками управления
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
    
    // Получаем героев из базы данных
    let query = db.select().from(heroes);
    
    // Если указан фильтр, добавляем его
    if (filter) {
      query = query.where(
        like(heroes.lastName, `%${filter}%`)
      );
    }
    
    // Получаем героев с пагинацией
    const heroesList = await query.limit(pageSize).offset(offset);
    
    // Получаем общее количество героев (для пагинации)
    let countQuery = db.select({ count: heroes.id }).from(heroes);
    if (filter) {
      countQuery = countQuery.where(
        like(heroes.lastName, `%${filter}%`)
      );
    }
    const countResult = await countQuery;
    const totalHeroes = countResult[0]?.count || 0;
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

// Функция для отправки списка школ с кнопками управления
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
    
    // Получаем школы из базы данных
    let query = db.select().from(schools);
    
    // Если указан фильтр, добавляем его
    if (filter) {
      query = query.where(
        like(schools.name, `%${filter}%`)
      );
    }
    
    // Получаем школы с пагинацией
    const schoolsList = await query.limit(pageSize).offset(offset);
    
    // Получаем общее количество школ (для пагинации)
    let countQuery = db.select({ count: schools.id }).from(schools);
    if (filter) {
      countQuery = countQuery.where(
        like(schools.name, `%${filter}%`)
      );
    }
    const countResult = await countQuery;
    const totalSchools = countResult[0]?.count || 0;
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

// Функция для отправки сообщения в Telegram с кнопками модерации
async function sendTelegramMessageWithButtons(message: string, heroId: number): Promise<{ success: boolean, messageId?: string }> {
  try {
    // Получаем токен бота и ID чата из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Проверяем наличие необходимых переменных окружения
    if (!botToken || !chatId) {
      console.error('Отсутствуют необходимые переменные окружения для Telegram бота');
      return { success: false };
    }

    // URL для API Telegram
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // Создаем кнопки для модерации
    const inlineKeyboard = {
      inline_keyboard: [
        [
          { 
            text: '✅ Принять', 
            callback_data: `approve_hero:${heroId}` 
          },
          { 
            text: '❌ Отклонить', 
            callback_data: `reject_hero:${heroId}` 
          }
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
        text: message,
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ошибка при отправке сообщения: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Ошибка при отправке сообщения: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Убедимся, что все данные корректны
    if (data.ok && data.result && typeof data.result.message_id !== 'undefined') {
      console.log('Сообщение успешно отправлено в Telegram, ID:', data.result.message_id);
      return { 
        success: true, 
        messageId: String(data.result.message_id) 
      };
    } else {
      console.warn('Сообщение отправлено, но ID не получен:', data);
      return { success: true };
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения в Telegram:', error);
    return { success: false };
  }
}

// Функция для отправки обычного сообщения в Telegram
async function sendTelegramMessage(message: string): Promise<boolean> {
  try {
    // Получаем токен бота и ID чата из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Проверяем наличие необходимых переменных окружения
    if (!botToken || !chatId) {
      console.error('Отсутствуют необходимые переменные окружения для Telegram бота');
      return false;
    }

    // URL для API Telegram
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
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка при отправке сообщения: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Ошибка при отправке сообщения в Telegram:', error);
    return false;
  }
}

/**
 * POST /api/telegram
 * Отправляет сообщение в Telegram
 */
export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию запроса по API ключу
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.API_KEY;

    if (!validApiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { success: false, error: 'Неверный API ключ' },
        { status: 401 }
      );
    }

    // Получаем данные из запроса
    const data = await request.json();
    
    if (!data.message) {
      return NextResponse.json(
        { success: false, error: 'Отсутствует обязательное поле "message"' },
        { status: 400 }
      );
    }

    // Если это сообщение о модерации героя
    if (data.heroId) {
      const result = await sendTelegramMessageWithButtons(data.message, data.heroId);
      
      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          messageId: result.messageId 
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Не удалось отправить сообщение в Telegram' },
          { status: 500 }
        );
      }
    } else {
      // Иначе обычное уведомление
      const success = await sendTelegramMessage(data.message);

      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { success: false, error: 'Не удалось отправить сообщение в Telegram' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/telegram/webhook
 * Обрабатывает вебхуки от Telegram с ответами на кнопки
 */
export async function GET(request: NextRequest) {
  try {
    // Получаем параметры запроса
    const searchParams = request.nextUrl.searchParams;
    const callbackData = searchParams.get('callback_data');
    const apiKey = searchParams.get('api_key');
    
    // Проверяем авторизацию запроса по API ключу
    const validApiKey = process.env.API_KEY;
    if (!validApiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { success: false, error: 'Неверный API ключ' },
        { status: 401 }
      );
    }

    if (!callbackData) {
      return NextResponse.json(
        { success: false, error: 'Отсутствуют данные callback_data' },
        { status: 400 }
      );
    }

    // Анализируем данные кнопки
    // формат: action:id - например, approve_hero:123 или reject_hero:123
    const [action, idStr] = callbackData.split(':');
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Некорректный ID героя' },
        { status: 400 }
      );
    }

    // Возвращаем данные для дальнейшей обработки
    return NextResponse.json({
      success: true,
      action,
      id
    });
  } catch (error) {
    console.error('Ошибка при обработке вебхука:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 