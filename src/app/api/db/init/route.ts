import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db/init';

// Эндпоинт для инициализации базы данных
export async function GET() {
  try {
    const result = await initDB();
    return NextResponse.json({ success: true, message: 'База данных успешно инициализирована', details: result });
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при инициализации базы данных' },
      { status: 500 }
    );
  }
} 