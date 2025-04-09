import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { schools } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * API для административных действий
 * Позволяет управлять списком школ и другими данными, требующими административных прав
 */

/**
 * GET /api/admin/schools
 * Получает список всех школ
 */
export async function GET(request: NextRequest) {
  try {
    // Проверяем авторизацию запроса по API ключу
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.ADMIN_API_KEY;

    if (!validApiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { success: false, error: 'Неверный API ключ' },
        { status: 401 }
      );
    }

    // Получаем список школ из базы данных
    const result = await db.select().from(schools);
    
    return NextResponse.json({ success: true, schools: result });
  } catch (error) {
    console.error('Ошибка при получении списка школ:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/schools
 * Добавляет новую школу в список
 */
export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию запроса по API ключу
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.ADMIN_API_KEY;

    if (!validApiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { success: false, error: 'Неверный API ключ' },
        { status: 401 }
      );
    }

    // Получаем данные из запроса
    const data = await request.json();
    
    if (!data.name) {
      return NextResponse.json(
        { success: false, error: 'Отсутствует обязательное поле "name"' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли уже такая школа
    const existingSchool = await db.select().from(schools).where(eq(schools.name, data.name)).limit(1);
    
    if (existingSchool.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Школа с таким названием уже существует' },
        { status: 400 }
      );
    }

    // Добавляем школу в базу данных
    const result = await db.insert(schools).values({
      name: data.name
    }).returning();

    // Отправляем уведомление в Telegram
    const telegramApiKey = process.env.API_KEY;
    if (telegramApiKey) {
      try {
        // Формируем сообщение
        const message = `<b>🏫 Новая школа добавлена в список!</b>\n\n<b>Название:</b> ${data.name}`;
        
        // Отправляем запрос к API Telegram
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`;
        await fetch(`${baseUrl}/api/telegram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': telegramApiKey
          },
          body: JSON.stringify({ message }),
        });
      } catch (telegramError) {
        console.error('Ошибка при отправке уведомления в Telegram:', telegramError);
      }
    }

    return NextResponse.json({ success: true, school: result[0] });
  } catch (error) {
    console.error('Ошибка при добавлении школы:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/schools
 * Удаляет школу из списка
 */
export async function DELETE(request: NextRequest) {
  try {
    // Проверяем авторизацию запроса по API ключу
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.ADMIN_API_KEY;

    if (!validApiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { success: false, error: 'Неверный API ключ' },
        { status: 401 }
      );
    }

    // Получаем данные из запроса
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'Отсутствует обязательное поле "id"' },
        { status: 400 }
      );
    }

    // Получаем информацию о школе перед удалением
    const schoolToDelete = await db.select().from(schools).where(eq(schools.id, data.id)).limit(1);
    
    if (schoolToDelete.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Школа с указанным ID не найдена' },
        { status: 404 }
      );
    }

    // Удаляем школу из базы данных
    await db.delete(schools).where(eq(schools.id, data.id));

    // Отправляем уведомление в Telegram
    const telegramApiKey = process.env.API_KEY;
    if (telegramApiKey) {
      try {
        // Формируем сообщение
        const message = `<b>🏫 Школа удалена из списка</b>\n\n<b>Название:</b> ${schoolToDelete[0].name}`;
        
        // Отправляем запрос к API Telegram
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`;
        await fetch(`${baseUrl}/api/telegram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': telegramApiKey
          },
          body: JSON.stringify({ message }),
        });
      } catch (telegramError) {
        console.error('Ошибка при отправке уведомления в Telegram:', telegramError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении школы:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}