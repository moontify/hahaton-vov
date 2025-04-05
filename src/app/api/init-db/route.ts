import { NextRequest, NextResponse } from 'next/server';
import { initDatabase } from '@/lib/mockDb';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const confirm = searchParams.get('confirm');
    
    if (confirm !== 'yes') {
      return NextResponse.json(
        { message: 'Для инициализации базы данных добавьте параметр ?confirm=yes' },
        { status: 400 }
      );
    }
    
    await initDatabase();
    
    return NextResponse.json(
      { message: 'База данных успешно инициализирована' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при инициализации базы данных' },
      { status: 500 }
    );
  }
}

async function seedDatabase() {
  const heroes = [
    {
      name: 'Жуков Георгий Константинович',
      rank: 'Маршал Советского Союза',
      region: 'Москва',
      description: 'Советский полководец, Маршал Советского Союза, четырежды Герой Советского Союза. Провёл успешные операции во время Великой Отечественной войны, включая оборону Ленинграда, битву за Москву, Сталинградскую и Курскую битвы.',
      years: '1896-1974',
      photo: 'https://virtual.uspu.ru/images/2021/12_%D0%B4%D0%B5%D0%BA%D0%B0%D0%B1%D1%80%D1%8C/01_%D0%96%D1%83%D0%BA%D0%BE%D0%B2/Georgiy-ZHukov-4.jpg',
      awards: ['Орден Победы', 'Герой Советского Союза', 'Орден Ленина', 'Орден Суворова']
    },
    {
      name: 'Гастелло Николай Францевич',
      rank: 'Капитан',
      region: 'Беларусь',
      description: 'Советский военный лётчик, командир экипажа бомбардировщика. Совершил огненный таран: направил горящий самолёт на колонну вражеской техники.',
      years: '1907-1941',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Gastello_Nikolay_Francievich.jpg',
      awards: ['Герой Советского Союза', 'Орден Ленина']
    },
    {
      name: 'Космодемьянская Зоя Анатольевна',
      rank: 'Красноармеец',
      region: 'Московская область',
      description: 'Партизанка, красноармеец диверсионно-разведывательной группы штаба Западного фронта. Первая женщина, удостоенная звания Героя Советского Союза (посмертно) в годы Великой Отечественной войны.',
      years: '1923-1941',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Zoya_Kosmodemyanskaya%2C_1941.png',
      awards: ['Герой Советского Союза', 'Орден Ленина']
    },
    {
      name: 'Матросов Александр Матвеевич',
      rank: 'Рядовой',
      region: 'Великие Луки',
      description: 'Советский пехотинец. Герой Советского Союза (посмертно), который закрыл своей грудью амбразуру немецкого дзота.',
      years: '1924-1943',
      photo: 'https://ivgoradm.ru/files/matrosov_foto.jpg',
      awards: ['Герой Советского Союза', 'Орден Ленина']
    },
    {
      name: 'Покрышкин Александр Иванович',
      rank: 'Маршал авиации',
      region: 'Новосибирск',
      description: 'Советский лётчик-истребитель, второй по результативности пилот среди союзников. Первый трижды Герой Советского Союза, один из лучших асов СССР.',
      years: '1913-1985',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Alexander_Pokryshkin_4.jpg/1200px-Alexander_Pokryshkin_4.jpg',
      awards: ['Герой Советского Союза', 'Орден Ленина', 'Орден Красного Знамени', 'Орден Суворова']
    },
    {
      name: 'Кожедуб Иван Никитович',
      rank: 'Маршал авиации',
      region: 'Сумская область',
      description: 'Лётчик-истребитель, наиболее результативный лётчик-истребитель среди пилотов стран антигитлеровской коалиции во Второй мировой войне.',
      years: '1920-1991',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Ivan_Kozhedub_2.jpg',
      awards: ['Герой Советского Союза', 'Орден Ленина', 'Орден Красного Знамени', 'Орден Александра Невского']
    }
  ];
  try {
    for (const hero of heroes) {
      const result = await sql`
        INSERT INTO heroes (name, rank, region, description, years, photo)
        VALUES (${hero.name}, ${hero.rank}, ${hero.region}, ${hero.description}, ${hero.years}, ${hero.photo})
        RETURNING *;
      `;
      const newHero = result.rows[0];
      if (hero.awards && hero.awards.length > 0) {
        for (const award of hero.awards) {
          await sql`
            INSERT INTO awards (hero_id, name)
            VALUES (${newHero.id}, ${award});
          `;
        }
      }
    }
    console.log('Тестовые данные успешно добавлены');
  } catch (error) {
    console.error('Ошибка при добавлении тестовых данных:', error);
    throw error;
  }
} 