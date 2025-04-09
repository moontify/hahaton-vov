import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { schools } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

/**
 * GET /api/schools
 * Публичный API-эндпоинт для получения списка школ
 * Не требует API-ключа для доступа
 * Возвращает только названия школ для использования на клиенте
 */
export async function GET() {
  try {
    // Получаем список школ из базы данных, сортированный по алфавиту
    const schoolsList = await db.select().from(schools).orderBy(asc(schools.name));

    // Извлекаем только названия школ
    const schoolNames = schoolsList.map(school => school.name);

    // Возвращаем данные
    return NextResponse.json({
      success: true,
      schools: schoolNames
    });
  } catch (error) {
    console.error('Ошибка при получении списка школ:', error);
    
    // В случае ошибки возвращаем сообщение об ошибке
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении списка школ' 
      },
      { status: 500 }
    );
  }
} 