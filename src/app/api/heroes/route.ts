import { NextRequest, NextResponse } from 'next/server';
import { Hero } from '@/types';
import { db } from '@/lib/db';
import { heroes, heroesModeration } from '@/lib/db/schema';
import { eq, like, and, or } from 'drizzle-orm';
import { initDB } from '@/lib/db/init';

// Флаг, указывающий, была ли инициализирована база данных
let dbInitialized = false;

// Функция для проверки и инициализации базы данных
async function ensureDbInitialized() {
  if (!dbInitialized) {
    try {
      console.log('Автоматическая инициализация базы данных...');
      await initDB();
      dbInitialized = true;
    } catch (error) {
      console.error('Ошибка при инициализации базы данных:', error);
      throw error;
    }
  }
}

// Временные данные для примера
const mockHeroes: Hero[] = [
  {
    id: '1',
    name: 'Иванов Иван Иванович',
    rank: 'Генерал-майор',
    region: 'Москва',
    description: 'Выдающийся полководец, участник крупнейших операций Великой Отечественной войны. Проявил отвагу при обороне Москвы и участвовал в Берлинской операции.',
    years: '1900-1975',
    photo: '/images/heroes/hero1.jpg',
    awards: ['Орден Красной Звезды', 'Медаль За отвагу', 'Орден Александра Невского']
  },
  {
    id: '2',
    name: 'Петров Пётр Петрович',
    rank: 'Капитан',
    region: 'Санкт-Петербург (Ленинград)',
    description: 'Участник обороны Ленинграда. Организовал снабжение города по Дороге жизни, спас десятки мирных жителей.',
    years: '1915-1943',
    photo: '/images/heroes/hero2.jpg',
    awards: ['Орден Отечественной войны I степени', 'Медаль За оборону Ленинграда']
  },
  {
    id: '3',
    name: 'Смирнова Анна Николаевна',
    rank: 'Старший лейтенант медицинской службы',
    region: 'Волгоград (Сталинград)',
    description: 'Военный врач, спасла сотни раненых во время Сталинградской битвы, работая в полевом госпитале под непрерывными бомбежками.',
    years: '1918-2001',
    photo: '/images/heroes/hero3.jpg',
    awards: ['Орден Красного Знамени', 'Медаль За оборону Сталинграда', 'Орден Ленина']
  },
  {
    id: '4',
    name: 'Соколов Александр Васильевич',
    rank: 'Сержант',
    region: 'Курская область',
    description: 'Командир танкового экипажа, участник Курской битвы. Уничтожил несколько немецких танков и спас своих товарищей из горящей машины.',
    years: '1922-1999',
    photo: '/images/heroes/hero4.jpg',
    awards: ['Орден Славы III степени', 'Медаль За отвагу']
  },
  {
    id: '5',
    name: 'Козлов Дмитрий Николаевич',
    rank: 'Лейтенант',
    region: 'Белгородская область',
    description: 'Командир стрелкового взвода, проявил героизм при освобождении населенных пунктов Белгородской области.',
    years: '1920-1943',
    photo: '/images/heroes/hero5.jpg',
    awards: ['Орден Красного Знамени', 'Медаль За отвагу']
  }
];

/**
 * GET /api/heroes
 * Возвращает список героев с фильтрацией
 */
export async function GET(request: Request) {
  try {
    // Убедимся, что база данных инициализирована
    await ensureDbInitialized();
    
    const { searchParams } = new URL(request.url);
    
    // Получаем параметры фильтрации
    const lastName = searchParams.get('lastName');
    const firstName = searchParams.get('firstName');
    const middleName = searchParams.get('middleName');
    const school = searchParams.get('school');
    const classParam = searchParams.get('class');
    const award = searchParams.get('award');
    const birthYear = searchParams.get('birthYear');
    
    let filters = [];
    
    // Добавляем фильтры, если они указаны
    if (lastName) {
      filters.push(like(heroes.lastName, `%${lastName}%`));
    }
    
    if (firstName) {
      filters.push(like(heroes.firstName, `%${firstName}%`));
    }
    
    if (middleName) {
      filters.push(like(heroes.middleName, `%${middleName}%`));
    }
    
    if (school) {
      filters.push(like(heroes.school, `%${school}%`));
    }
    
    if (classParam) {
      filters.push(like(heroes.class, `%${classParam}%`));
    }
    
    if (award) {
      filters.push(like(heroes.awards, `%${award}%`));
    }
    
    if (birthYear) {
      filters.push(eq(heroes.birthYear, parseInt(birthYear)));
    }
    
    // Выполняем запрос с фильтрами или без них
    let result;
    if (filters.length > 0) {
      result = await db.select().from(heroes).where(and(...filters));
    } else {
      result = await db.select().from(heroes);
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при получении героев:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении героев' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/heroes
 * Добавляет нового героя на модерацию
 */
export async function POST(request: Request) {
  try {
    // Убедимся, что база данных инициализирована
    await ensureDbInitialized();
    
    const body = await request.json();
    
    // Проверяем обязательные поля
    if (!body.lastName || !body.firstName || !body.school || !body.class || !body.addedBy) {
      return NextResponse.json(
        { error: 'Необходимо заполнить обязательные поля' },
        { status: 400 }
      );
    }
    
    // Добавляем героя в таблицу модерации вместо основной таблицы
    // Так как теперь герои проходят модерацию перед добавлением в основную таблицу
    const isNewSchool = !!body.isNewSchool;
    
    const result = await db.insert(heroesModeration).values({
      lastName: body.lastName,
      firstName: body.firstName,
      middleName: body.middleName,
      birthYear: body.birthYear,
      deathYear: body.deathYear,
      awards: body.awards,
      school: body.school,
      class: body.class,
      addedBy: body.addedBy,
      isNewSchool: isNewSchool,
      status: 'pending'
    }).returning();
    
    const newHero = result[0];
    
    // Отправляем уведомление в Telegram, если задан API ключ
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      try {
        // Формируем сообщение для Telegram
        let message = `<b>🎖️ Новый герой на модерацию!</b>\n\n`;
        message += `<b>ФИО:</b> ${body.lastName} ${body.firstName} ${body.middleName || ''}\n`;
        message += `<b>Школа:</b> ${body.school}\n`;
        message += `<b>Класс:</b> ${body.class}\n`;
        message += `<b>Добавил:</b> ${body.addedBy}\n`;
        
        if (body.birthYear) {
          message += `<b>Год рождения:</b> ${body.birthYear}\n`;
        }
        
        if (body.deathYear) {
          message += `<b>Год смерти:</b> ${body.deathYear}\n`;
        }
        
        if (body.awards) {
          message += `<b>Награды:</b> ${body.awards}\n`;
        }
        
        // Если это новая школа, добавляем информацию об этом
        if (isNewSchool) {
          message += `\n<b>⚠️ Внимание!</b> Добавлена новая школа: <b>${body.school}</b>\n`;
          message += `Требуется модерация и добавление в общий список школ.`;
        }
        
        // Отправляем запрос к API Telegram с кнопками для модерации
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`;
        const telegramResponse = await fetch(`${baseUrl}/api/telegram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
          },
          body: JSON.stringify({ 
            message, 
            heroId: newHero.id 
          }),
        });
        
        const telegramResult = await telegramResponse.json();
        
        // Если есть ID сообщения, сохраняем его в записи о герое
        if (telegramResult.messageId) {
          await db.update(heroesModeration)
            .set({ telegramMessageId: telegramResult.messageId })
            .where(eq(heroesModeration.id, newHero.id));
        }
      } catch (telegramError) {
        // Логируем ошибку, но не прерываем выполнение запроса
        console.error('Ошибка при отправке уведомления в Telegram:', telegramError);
      }
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Ошибка при добавлении героя:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении героя' },
      { status: 500 }
    );
  }
} 