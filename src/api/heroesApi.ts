import { Hero, HeroFilter } from '@/types';

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

// Функция для инициализации героев в localStorage
const initHeroes = (): Hero[] => {
  if (typeof window === 'undefined') return defaultHeroes;
  
  try {
    const storedHeroes = localStorage.getItem('heroes');
    if (!storedHeroes) {
      localStorage.setItem('heroes', JSON.stringify(defaultHeroes));
      return defaultHeroes;
    }
    
    return JSON.parse(storedHeroes);
  } catch (error) {
    console.error('Ошибка при инициализации героев:', error);
    return defaultHeroes;
  }
};

// Функция для сохранения героев в localStorage
const saveHeroes = (heroes: Hero[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('heroes', JSON.stringify(heroes));
    console.log('Герои сохранены в localStorage', heroes.length);
  } catch (error) {
    console.error('Ошибка при сохранении героев:', error);
  }
};

// Функция фильтрации героев
const filterHeroes = (heroes: Hero[], filters: HeroFilter): Hero[] => {
  return heroes.filter(hero => {
    // Поиск по имени или описанию
    const matchesSearch = !filters.searchQuery || 
      hero.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
      hero.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    // Фильтрация по региону
    const matchesRegion = !filters.region || hero.region === filters.region;
    
    // Фильтрация по званию
    const matchesRank = !filters.rank || hero.rank === filters.rank;
    
    // Фильтрация по наградам
    const matchesAward = !filters.award || 
      hero.awards.some(award => award.toLowerCase().includes(filters.award.toLowerCase()));
    
    // Фильтрация по годам рождения
    const birthYear = hero.years.split('-')[0];
    const matchesYearFrom = !filters.yearFrom || parseInt(birthYear) >= parseInt(filters.yearFrom);
    const matchesYearTo = !filters.yearTo || parseInt(birthYear) <= parseInt(filters.yearTo);
    
    return matchesSearch && matchesRegion && matchesRank && matchesAward && matchesYearFrom && matchesYearTo;
  });
};

/**
 * Получение списка героев с фильтрацией
 */
export async function getHeroes(filters?: HeroFilter): Promise<Hero[]> {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const heroes = initHeroes();
    
    if (!filters) return heroes;
    
    return filterHeroes(heroes, filters);
  } catch (error) {
    console.error('Ошибка при получении героев:', error);
    return [];
  }
}

/**
 * Получение героя по ID
 */
export async function getHeroById(id: string): Promise<Hero | null> {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const heroes = initHeroes();
    const hero = heroes.find(h => h.id === id);
    
    return hero || null;
  } catch (error) {
    console.error(`Ошибка при получении героя с ID ${id}:`, error);
    return null;
  }
}

/**
 * Добавление нового героя
 */
export async function addHero(heroData: Partial<Hero>): Promise<Hero> {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    const heroes = initHeroes();
    
    // Генерация нового ID
    const maxId = heroes.length > 0 ? Math.max(...heroes.map(h => parseInt(h.id))) : 0;
    const newId = (maxId + 1).toString();
    
    // Создание нового героя
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
    
    console.log('Добавлен новый герой:', newHero);
    
    return newHero;
  } catch (error) {
    console.error('Ошибка при добавлении героя:', error);
    throw error;
  }
}

/**
 * Обновление данных о герое
 */
export async function updateHero(id: string, heroData: Partial<Hero>): Promise<Hero> {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 600));
  
  try {
    const heroes = initHeroes();
    const index = heroes.findIndex(h => h.id === id);
    
    if (index === -1) {
      throw new Error('Герой не найден');
    }
    
    // Обновление данных героя
    const updatedHero: Hero = {
      ...heroes[index],
      ...heroData,
      id, // ID не меняется
    };
    
    heroes[index] = updatedHero;
    
    // Сохранение обновленного списка
    saveHeroes(heroes);
    
    return updatedHero;
  } catch (error) {
    console.error(`Ошибка при обновлении героя с ID ${id}:`, error);
    throw error;
  }
}

/**
 * Удаление героя
 */
export async function deleteHero(id: string): Promise<{ success: boolean }> {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 400));
  
  try {
    const heroes = initHeroes();
    const filteredHeroes = heroes.filter(h => h.id !== id);
    
    // Сохранение обновленного списка
    saveHeroes(filteredHeroes);
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении героя с ID ${id}:`, error);
    throw error;
  }
} 