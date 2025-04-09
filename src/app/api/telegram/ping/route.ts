import { NextResponse } from 'next/server';

/**
 * GET /api/telegram/ping
 * Сервис пинга для предотвращения "засыпания" serverless-функций
 * Используется для поддержания Telegram webhook в активном состоянии
 */
export async function GET() {
  try {
    console.log(`Ping webhook сервиса: ${new Date().toISOString()}`);
    
    // Для поддержания webhook активным, можно сделать запрос к самому API
    try {
      // Делаем http запрос к нашему же webhook для поддержания функции активной
      const webhookUrl = process.env.NEXT_PUBLIC_BASE_URL 
        ? `https://${process.env.NEXT_PUBLIC_BASE_URL}/api/telegram/webhook` 
        : 'http://localhost:3000/api/telegram/webhook';
      
      await fetch(webhookUrl, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'TelegramBotPingService/1.0',
        },
      }).catch(() => {
        // Игнорируем ошибки при пинге
        // Главное - попытаться "разбудить" функцию
      });
    } catch (error) {
      // Игнорируем ошибки при пинге
    }
    
    return new NextResponse('Telegram webhook alive', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Ошибка в сервисе пинга:', error);
    return new NextResponse('Error in ping service', { status: 500 });
  }
} 