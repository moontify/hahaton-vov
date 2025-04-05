// Заглушка 
// Интерфейс для имитации результатов запроса
interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

// Интерфейс для работы с БД
interface Database {
  query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

// Данные о героях для имитации работы с БД
const heroes = [
  {
    id: '1',
    name: 'Иванов Иван Иванович',
    rank: 'Генерал-майор',
    region: 'Москва',
    description: 'Выдающийся полководец, участник крупнейших операций Великой Отечественной войны. Проявил отвагу при обороне Москвы и участвовал в Берлинской операции.',
    years: '1900-1975',
    photo: '/images/heroes/hero1.jpg'
  },
  {
    id: '2',
    name: 'Петров Пётр Петрович',
    rank: 'Капитан',
    region: 'Санкт-Петербург (Ленинград)',
    description: 'Участник обороны Ленинграда. Организовал снабжение города по Дороге жизни, спас десятки мирных жителей.',
    years: '1915-1943',
    photo: '/images/heroes/hero2.jpg'
  },
  {
    id: '3',
    name: 'Смирнова Анна Николаевна',
    rank: 'Старший лейтенант медицинской службы',
    region: 'Волгоград (Сталинград)',
    description: 'Военный врач, спасла сотни раненых во время Сталинградской битвы, работая в полевом госпитале под непрерывными бомбежками.',
    years: '1918-2001',
    photo: '/images/heroes/hero3.jpg'
  }
];

// Данные о наградах
const awards = [
  { hero_id: '1', award_name: 'Орден Красной Звезды' },
  { hero_id: '1', award_name: 'Медаль За отвагу' },
  { hero_id: '1', award_name: 'Орден Александра Невского' },
  { hero_id: '2', award_name: 'Орден Отечественной войны I степени' },
  { hero_id: '2', award_name: 'Медаль За оборону Ленинграда' },
  { hero_id: '3', award_name: 'Орден Красного Знамени' },
  { hero_id: '3', award_name: 'Медаль За оборону Сталинграда' },
  { hero_id: '3', award_name: 'Орден Ленина' }
];

// Создаем заглушку для БД
const mockDatabase: Database = {
  // Имитация выполнения SQL-запросов
  async query<T>(text: string, params: any[] = []): Promise<QueryResult<T>> {
    console.log('Выполнение запроса:', text, params);
    
    // Имитация простых запросов SELECT
    if (text.toLowerCase().includes('select * from heroes')) {
      let filteredHeroes = [...heroes] as any[];
      
      // Простая имитация фильтрации
      if (params.length > 0) {
        // Фильтрация по имени или описанию
        if (text.includes('name LIKE ?') && params[0]) {
          const searchTerm = params[0].replace(/%/g, '').toLowerCase();
          filteredHeroes = filteredHeroes.filter(hero => 
            hero.name.toLowerCase().includes(searchTerm) || 
            hero.description.toLowerCase().includes(searchTerm)
          );
        }
        
        // Фильтрация по региону
        if (text.includes('region = ?') && params.some(p => p !== '')) {
          const regionIndex = params.findIndex(p => heroes.some(h => h.region === p));
          if (regionIndex !== -1) {
            const region = params[regionIndex];
            filteredHeroes = filteredHeroes.filter(hero => hero.region === region);
          }
        }
        
        // Фильтрация по званию
        if (text.includes('rank = ?') && params.some(p => p !== '')) {
          const rankIndex = params.findIndex(p => heroes.some(h => h.rank === p));
          if (rankIndex !== -1) {
            const rank = params[rankIndex];
            filteredHeroes = filteredHeroes.filter(hero => hero.rank === rank);
          }
        }
      }
      
      return {
        rows: filteredHeroes as T[],
        rowCount: filteredHeroes.length
      };
    }
    
    // Имитация запроса наград
    if (text.toLowerCase().includes('select hero_id, award_name from hero_awards')) {
      const heroIds = params;
      const filteredAwards = awards.filter(award => 
        heroIds.includes(award.hero_id)
      );
      
      return {
        rows: filteredAwards as any as T[],
        rowCount: filteredAwards.length
      };
    }
    
    // Имитация вставки нового героя
    if (text.toLowerCase().includes('insert into heroes')) {
      const newId = (Math.max(...heroes.map(h => parseInt(h.id))) + 1).toString();
      const newHero = {
        id: newId,
        name: params[0],
        rank: params[1],
        region: params[2],
        description: params[3],
        years: params[4],
        photo: params[5]
      };
      
      heroes.push(newHero);
      
      return {
        rows: [newHero] as any as T[],
        rowCount: 1
      };
    }
    
    // Имитация вставки наград
    if (text.toLowerCase().includes('insert into hero_awards')) {
      const newAwards: typeof awards = [];
      
      // Обрабатываем пары [heroId, awardName]
      for (let i = 0; i < params.length; i += 2) {
        if (i + 1 < params.length) {
          newAwards.push({
            hero_id: params[i],
            award_name: params[i + 1]
          });
        }
      }
      
      awards.push(...newAwards);
      
      return {
        rows: newAwards as any as T[],
        rowCount: newAwards.length
      };
    }
    
    // Имитация получения наград для героя
    if (text.toLowerCase().includes('select award_name from hero_awards where hero_id')) {
      const heroId = params[0];
      const heroAwards = awards.filter(award => award.hero_id === heroId);
      
      return {
        rows: heroAwards as any as T[],
        rowCount: heroAwards.length
      };
    }
    
    // Заглушка для других запросов
    return {
      rows: [] as T[],
      rowCount: 0
    };
  },
  
  // Заглушки для подключения/отключения
  async connect(): Promise<void> {
    console.log('Подключение к базе данных...');
  },
  
  async disconnect(): Promise<void> {
    console.log('Отключение от базы данных...');
  }
};

// Инициализация подключения к БД
export const db = mockDatabase;

// Вспомогательные функции для работы с БД
export async function getHeroes(filters = {}) {
  // Пример использования: const heroes = await getHeroes({ region: 'Москва' });
  return db.query('SELECT * FROM heroes WHERE 1=1');
}

export async function getHeroById(id: string) {
  // Пример использования: const hero = await getHeroById('1');
  const result = await db.query('SELECT * FROM heroes WHERE id = ?', [id]);
  return result.rows[0] || null;
}

export async function getHeroAwards(heroId: string) {
  // Пример использования: const awards = await getHeroAwards('1');
  const result = await db.query(
    'SELECT award_name FROM hero_awards WHERE hero_id = ?', 
    [heroId]
  );
  return result.rows.map(row => (row as any).award_name);
}

export async function addHeroAwards(heroId: string, awards: string[]) {
  if (!awards || awards.length === 0) return [];
  
  const values = awards.map(award => [heroId, award]);
  
  const result = await db.query(
    `INSERT INTO hero_awards (hero_id, award_name) 
     VALUES ${values.map(() => '(?, ?)').join(', ')}`,
    values.flat()
  );
  
  return result.rows;
}

export async function initDatabase() {
  console.log('Инициализация базы данных...');
  // В реальном приложении здесь было бы создание таблиц и т.д.
} 