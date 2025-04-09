import { Hero, HeroFilter } from '@/types';

// Кэш для хранения результатов запросов
const requestCache = new Map();
const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 минут

// Массив героев по умолчанию для демонстрации
const defaultHeroes: Hero[] = [
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

// Функция для получения данных с кэшированием
async function fetchWithCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const cachedData = requestCache.get(key);
  
  // Если в кэше есть данные и они не устарели, возвращаем их
  if (cachedData && now - cachedData.timestamp < CACHE_TIMEOUT) {
    return cachedData.data;
  }
  
  try {
    // Получаем свежие данные
    const data = await fetchFn();
    
    // Сохраняем в кэш с текущей временной меткой
    requestCache.set(key, { 
      data, 
      timestamp: now 
    });
    
    return data;
  } catch (error) {
    // Если есть устаревшие данные, лучше вернуть их, чем ничего
    if (cachedData) {
      console.warn(`Ошибка получения свежих данных, используем кэш для "${key}"`);
      return cachedData.data;
    }
    throw error;
  }
}

// Инициализация хранилища героев (в локальном хранилище или воссоздание из defaultHeroes)
function initHeroes(): Hero[] {
  try {
    if (typeof window !== 'undefined') {
      const storedHeroes = localStorage.getItem('heroes');
      if (storedHeroes) {
        return JSON.parse(storedHeroes);
      }
      // Если в localStorage ничего нет, сохраняем туда defaultHeroes
      localStorage.setItem('heroes', JSON.stringify(defaultHeroes));
    }
    return defaultHeroes;
  } catch (error) {
    console.error('Ошибка при инициализации хранилища героев:', error);
    return defaultHeroes;
  }
}

// Сохранение списка героев
function saveHeroes(heroes: Hero[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('heroes', JSON.stringify(heroes));
    }
  } catch (error) {
    console.error('Ошибка при сохранении героев:', error);
  }
}

/**
 * Получение всех героев с учетом фильтров
 */
export async function getHeroes(filters?: HeroFilter): Promise<Hero[]> {
  // Генерируем ключ кэша на основе фильтров
  const cacheKey = `heroes:${JSON.stringify(filters || {})}`;
  
  return fetchWithCache(cacheKey, async () => {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300)); // Уменьшена задержка с 800 до 300 мс
    
    try {
      // Получаем начальные данные
      const heroes = initHeroes();
      
      // Если фильтров нет, возвращаем всех героев
      if (!filters) {
        return heroes;
      }
      
      // Применяем фильтры
      return heroes.filter(hero => {
        let matches = true;
        
        // Фильтр по имени
        if (filters.searchQuery) {
          matches = matches && hero.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
        }
        
        // Фильтр по региону
        if (filters.region) {
          matches = matches && hero.region === filters.region;
        }
        
        // Фильтр по званию
        if (filters.rank) {
          matches = matches && hero.rank === filters.rank;
        }
        
        // Дополнительно можно фильтровать по годам, наградам и т.д.
        
        return matches;
      });
    } catch (error) {
      console.error('Ошибка при получении списка героев:', error);
      return [];
    }
  });
}

/**
 * Получение одного героя по ID
 */
export async function getHeroById(id: string): Promise<Hero | null> {
  const cacheKey = `hero:${id}`;
  
  return fetchWithCache(cacheKey, async () => {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 200)); // Уменьшена задержка для единичного запроса
    
    try {
      const heroes = initHeroes();
      return heroes.find(hero => hero.id === id) || null;
    } catch (error) {
      console.error(`Ошибка при получении героя с ID ${id}:`, error);
      return null;
    }
  });
}

/**
 * Добавление нового героя с оптимизацией
 */
export async function addHero(heroData: Partial<Hero>): Promise<Hero> {
  // Имитация задержки сети, но меньше чем раньше
  await new Promise(resolve => setTimeout(resolve, 400));
  
  try {
    const heroes = initHeroes();
    
    // Генерация нового ID
    const maxId = heroes.length > 0 ? Math.max(...heroes.map(h => parseInt(h.id))) : 0;
    const newId = (maxId + 1).toString();
    
    // Создание нового героя с оптимизацией данных
    const newHero: Hero = {
      id: newId,
      name: heroData.name || 'Неизвестный герой',
      rank: heroData.rank || 'Неизвестно',
      region: heroData.region || 'Неизвестный регион',
      description: heroData.description || '',
      years: heroData.years || '',
      photo: heroData.photo || '/images/heroes/placeholder.jpg',
      awards: Array.isArray(heroData.awards) ? heroData.awards : [],
    };
    
    // Добавление героя в список
    const updatedHeroes = [...heroes, newHero];
    
    // Сохранение обновленного списка
    saveHeroes(updatedHeroes);
    
    // Обновляем кэш, чтобы следующие запросы получали актуальные данные
    requestCache.delete('heroes:{}');
    
    console.log('Добавлен новый герой:', newHero);
    
    return newHero;
  } catch (error) {
    console.error('Ошибка при добавлении героя:', error);
    throw error;
  }
}

/**
 * Поиск героев по тексту
 */
export async function searchHeroes(query: string): Promise<Hero[]> {
  if (!query) return [];
  
  const cacheKey = `search:${query}`;
  
  return fetchWithCache(cacheKey, async () => {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const heroes = initHeroes();
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      
      if (searchTerms.length === 0) return [];
      
      // Оптимизированный алгоритм поиска
      return heroes.filter(hero => {
        const heroText = `${hero.name} ${hero.rank} ${hero.region} ${hero.description}`.toLowerCase();
        
        // Проверяем, содержит ли текст героя все поисковые термины
        return searchTerms.every(term => heroText.includes(term));
      });
    } catch (error) {
      console.error('Ошибка при поиске героев:', error);
      return [];
    }
  });
}

/**
 * Удаление героя
 */
export async function deleteHero(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  try {
    const heroes = initHeroes();
    const updatedHeroes = heroes.filter(hero => hero.id !== id);
    
    // Если количество не изменилось, значит героя не нашли
    if (heroes.length === updatedHeroes.length) {
      return false;
    }
    
    saveHeroes(updatedHeroes);
    
    // Очищаем все связанные кэши
    for (const key of Array.from(requestCache.keys())) {
      if (key.startsWith('heroes:') || key === `hero:${id}`) {
        requestCache.delete(key);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Ошибка при удалении героя с ID ${id}:`, error);
    return false;
  }
}

/**
 * Получение уникальных регионов для фильтрации
 */
export async function getUniqueRegions(): Promise<string[]> {
  const cacheKey = 'regions';
  
  return fetchWithCache(cacheKey, async () => {
    try {
      const heroes = initHeroes();
      
      // Получаем уникальные регионы
      const regions = [...new Set(heroes.map(hero => hero.region))].filter(Boolean);
      return regions.sort();
    } catch (error) {
      console.error('Ошибка при получении списка регионов:', error);
      return [];
    }
  });
}

/**
 * Получение уникальных званий для фильтрации
 */
export async function getUniqueRanks(): Promise<string[]> {
  const cacheKey = 'ranks';
  
  return fetchWithCache(cacheKey, async () => {
    try {
      const heroes = initHeroes();
      
      // Получаем уникальные звания
      const ranks = [...new Set(heroes.map(hero => hero.rank))].filter(Boolean);
      return ranks.sort();
    } catch (error) {
      console.error('Ошибка при получении списка званий:', error);
      return [];
    }
  });
} 