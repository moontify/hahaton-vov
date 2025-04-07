import { NextRequest, NextResponse } from 'next/server';
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
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const region = searchParams.get('region') || '';
  const rank = searchParams.get('rank') || '';
  const award = searchParams.get('award') || '';
  const yearFrom = searchParams.get('yearFrom') || '';
  const yearTo = searchParams.get('yearTo') || '';
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    // Используем моковые данные с фильтрацией
    let heroes = [...mockHeroes];
    
    // Фильтрация по имени или описанию
    if (search) {
      const searchLower = search.toLowerCase();
      heroes = heroes.filter(hero => 
        hero.name.toLowerCase().includes(searchLower) || 
        hero.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Фильтрация по региону
    if (region) {
      heroes = heroes.filter(hero => hero.region === region);
    }
    
    // Фильтрация по званию
    if (rank) {
      heroes = heroes.filter(hero => hero.rank === rank);
    }
    
    // Фильтрация по наградам
    if (award) {
      const awardLower = award.toLowerCase();
      heroes = heroes.filter(hero => 
        hero.awards.some(a => a.toLowerCase().includes(awardLower))
      );
    }
    
    // Фильтрация по годам
    if (yearFrom) {
      heroes = heroes.filter(hero => {
        const birthYear = parseInt(hero.years.split('-')[0]);
        return birthYear >= parseInt(yearFrom);
      });
    }
    
    if (yearTo) {
      heroes = heroes.filter(hero => {
        const birthYear = parseInt(hero.years.split('-')[0]);
        return birthYear <= parseInt(yearTo);
      });
    }
    
    // Ограничение количества
    heroes = heroes.slice(0, limit);

    // Добавляем задержку для имитации сетевого запроса
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(heroes);
  } catch (error) {
    console.error('Ошибка при получении списка героев:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка героев' }, 
      { status: 500 }
    );
  }
}

/**
 * GET /api/heroes/[id]
 * Возвращает информацию о герое по ID
 */
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
    
    // Создаем нового героя (демо-режим)
    const newHero: Hero = {
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
    
    // Добавляем задержку для имитации сетевого запроса
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return NextResponse.json(newHero);
  } catch (error) {
    console.error('Ошибка при добавлении героя:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении героя' }, 
      { status: 500 }
    );
  }
} 