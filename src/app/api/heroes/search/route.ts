import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

// API эндпоинт для поиска героев (проксирует запросы к "Память народа")
export async function POST(request: NextRequest) {
  try {
    // Получаем данные запроса от клиента
    const requestData = await request.json();
    
    // Проверяем наличие необходимых параметров
    if (!requestData || !requestData.parameters) {
      return NextResponse.json(
        { error: 'Некорректные параметры запроса' },
        { status: 400 }
      );
    }

    // Создаем HTTP-агент, который игнорирует ошибки сертификата
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    // Формируем запрос к API "Память народа"
    const response = await fetch("https://pamyat-naroda.ru/entrypoint/api/", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/137.0",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Csrf-Token": "13cd2ae3c74601ca11113d9e2.GDfmoBq_06OZS_7e5Ga_G2OuaaxndJahJSpOpGCTXM4.eWa0xX6Pvo60AY7zo1PHUCjfBJ0eRszKZFIW3AXACfd9TaDJLd6b6NF-vw"
      },
      body: JSON.stringify({
        entrypoint: "heroes/search",
        parameters: requestData.parameters
      }),
      // @ts-expect-error - игнорируем ошибку типа, так как fetch в Next.js немного отличается
      agent: httpsAgent
    });

    // Проверяем успешность запроса
    if (!response.ok) {
      return NextResponse.json(
        { error: `Ошибка запроса: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Получаем данные и передаем их клиенту
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Ошибка при проксировании запроса к API "Память народа":', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 