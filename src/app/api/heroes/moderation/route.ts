import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroesModeration } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * API для работы с героями на модерации
 */

/**
 * GET /api/heroes/moderation
 * Получает список героев на модерации
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

    // Получаем параметры запроса
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const school = searchParams.get('school');

    // Формируем условия запроса
    let query = db.select().from(heroesModeration);

    // Если указан статус, фильтруем по нему
    if (status) {
      query = query.where(eq(heroesModeration.status, status));
    }

    // Если указана школа, фильтруем по ней
    if (school) {
      query = query.where(eq(heroesModeration.school, school));
    }

    // Получаем данные
    const heroes = await query.orderBy(heroesModeration.createdAt);

    return NextResponse.json({
      success: true,
      heroes
    });
  } catch (error) {
    console.error('Ошибка при получении героев на модерации:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/heroes/moderation
 * Обновляет статус героя на модерации
 */
export async function PATCH(request: NextRequest) {
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
    
    if (!data.id || !data.status) {
      return NextResponse.json(
        { success: false, error: 'Отсутствуют обязательные поля id и status' },
        { status: 400 }
      );
    }

    // Проверяем, что статус допустим
    const allowedStatuses = ['pending', 'approved', 'rejected'];
    if (!allowedStatuses.includes(data.status)) {
      return NextResponse.json(
        { success: false, error: 'Недопустимый статус. Допустимые значения: pending, approved, rejected' },
        { status: 400 }
      );
    }

    // Получаем героя
    const hero = await db.select().from(heroesModeration).where(eq(heroesModeration.id, data.id)).limit(1);
    
    if (hero.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Герой не найден' },
        { status: 404 }
      );
    }

    // Обновляем статус героя
    await db.update(heroesModeration)
      .set({ status: data.status })
      .where(eq(heroesModeration.id, data.id));

    return NextResponse.json({
      success: true,
      message: `Статус героя успешно обновлен на "${data.status}"`
    });
  } catch (error) {
    console.error('Ошибка при обновлении статуса героя:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/heroes/moderation
 * Удаляет героя из таблицы модерации
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
        { success: false, error: 'Отсутствует обязательное поле id' },
        { status: 400 }
      );
    }

    // Получаем героя
    const hero = await db.select().from(heroesModeration).where(eq(heroesModeration.id, data.id)).limit(1);
    
    if (hero.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Герой не найден' },
        { status: 404 }
      );
    }

    // Удаляем героя
    await db.delete(heroesModeration).where(eq(heroesModeration.id, data.id));

    return NextResponse.json({
      success: true,
      message: 'Герой успешно удален из модерации'
    });
  } catch (error) {
    console.error('Ошибка при удалении героя:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 