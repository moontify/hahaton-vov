import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockDb';
import { Hero } from '@/types';

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
  }
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const region = searchParams.get('region') || '';
  const rank = searchParams.get('rank') || '';
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    let heroes;
    
    // Если у нас есть доступ к базе данных, выполняем запрос к ней
    if (db) {
      // Строим SQL-запрос с условиями фильтрации
      let query = 'SELECT * FROM heroes WHERE 1=1';
      const queryParams = [];
      
      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        queryParams.push(`%${search}%`, `%${search}%`);
      }
      
      if (region) {
        query += ' AND region = ?';
        queryParams.push(region);
      }
      
      if (rank) {
        query += ' AND rank = ?';
        queryParams.push(rank);
      }
      
      query += ' LIMIT ?';
      queryParams.push(limit);
      
      // Выполняем запрос к БД
      const result = await db.query(query, queryParams);
      heroes = result.rows;
      
      // Получаем награды для каждого героя из связанной таблицы
      const heroIds = heroes.map(hero => hero.id);
      if (heroIds.length > 0) {
        const awardsQuery = `
          SELECT hero_id, award_name 
          FROM hero_awards 
          WHERE hero_id IN (${heroIds.map(() => '?').join(',')})
        `;
        
        const awardsResult = await db.query(awardsQuery, heroIds);
        
        // Добавляем награды к героям
        heroes = heroes.map(hero => ({
          ...hero,
          awards: awardsResult.rows
            .filter((award: {hero_id: string, award_name: string}) => award.hero_id === hero.id)
            .map((award: {hero_id: string, award_name: string}) => award.award_name)
        }));
      }
    } else {
      // Если БД не доступна, используем моковые данные
      heroes = mockHeroes.filter(hero => {
        const matchesSearch = !search || 
          hero.name.toLowerCase().includes(search.toLowerCase()) || 
          hero.description.toLowerCase().includes(search.toLowerCase());
          
        const matchesRegion = !region || hero.region === region;
        
        const matchesRank = !rank || hero.rank === rank;
        
        return matchesSearch && matchesRegion && matchesRank;
      }).slice(0, limit);
    }

    return NextResponse.json(heroes);
  } catch (error) {
    console.error('Ошибка при получении списка героев:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка героев' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const heroData = await request.json();
    
    // Проверяем обязательные поля
    if (!heroData.name) {
      return NextResponse.json(
        { error: 'Имя героя обязательно' }, 
        { status: 400 }
      );
    }
    
    let newHero;
    
    // Если у нас есть доступ к базе данных
    if (db) {
      // Создаем запись в таблице heroes
      const insertResult = await db.query(
        `INSERT INTO heroes (name, rank, region, description, years, photo) 
         VALUES (?, ?, ?, ?, ?, ?) 
         RETURNING *`,
        [
          heroData.name,
          heroData.rank || '',
          heroData.region || '',
          heroData.description || '',
          heroData.years || '',
          heroData.photo || '/images/heroes/placeholder.jpg'
        ]
      );
      
      const hero = insertResult.rows[0];
      
      // Если есть награды, добавляем их в таблицу hero_awards
      if (heroData.awards && Array.isArray(heroData.awards) && heroData.awards.length > 0) {
        const awardsValues = heroData.awards.map(award => [hero.id, award]);
        
        await db.query(
          `INSERT INTO hero_awards (hero_id, award_name) 
           VALUES ${awardsValues.map(() => '(?, ?)').join(', ')}`,
          awardsValues.flat()
        );
        
        // Получаем добавленные награды
        const awardsResult = await db.query(
          'SELECT award_name FROM hero_awards WHERE hero_id = ?',
          [hero.id]
        );
        
        // Добавляем список наград к объекту героя
        hero.awards = awardsResult.rows.map(row => row.award_name);
      } else {
        hero.awards = [];
      }
      
      newHero = hero;
    } else {
      // Если БД не доступна, создаем новый объект с моковым ID
      newHero = {
        id: (mockHeroes.length + 1).toString(),
        name: heroData.name,
        rank: heroData.rank || '',
        region: heroData.region || '',
        description: heroData.description || '',
        years: heroData.years || '',
        photo: heroData.photo || '/images/heroes/placeholder.jpg',
        awards: Array.isArray(heroData.awards) ? heroData.awards : []
      };
      
      // Добавляем в моковый массив
      mockHeroes.push(newHero);
    }
    
    return NextResponse.json(newHero);
  } catch (error) {
    console.error('Ошибка при добавлении героя:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении героя' }, 
      { status: 500 }
    );
  }
} 