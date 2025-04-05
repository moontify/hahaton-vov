import { Hero } from '@/types';

/**
 * Получение списка героев с фильтрацией
 */
export async function getHeroes(params?: {
  search?: string;
  region?: string;
  rank?: string;
  limit?: number;
}) {
  const urlParams = new URLSearchParams();
  
  if (params?.search) urlParams.append('search', params.search);
  if (params?.region) urlParams.append('region', params.region);
  if (params?.rank) urlParams.append('rank', params.rank);
  if (params?.limit) urlParams.append('limit', params.limit.toString());
  
  const queryString = urlParams.toString();
  const url = `/api/heroes${queryString ? '?' + queryString : ''}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Ошибка при получении данных о героях');
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении героев:', error);
    throw error;
  }
}

/**
 * Получение героя по ID
 */
export async function getHeroById(id: string) {
  try {
    const response = await fetch(`/api/heroes/${id}`);
    if (!response.ok) {
      throw new Error('Герой не найден');
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при получении героя с ID ${id}:`, error);
    throw error;
  }
}

/**
 * Добавление нового героя
 */
export async function addHero(heroData: Partial<Hero>) {
  try {
    const response = await fetch('/api/heroes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(heroData),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при добавлении героя');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при добавлении героя:', error);
    throw error;
  }
}

/**
 * Обновление данных о герое
 */
export async function updateHero(id: string, heroData: Partial<Hero>) {
  try {
    const response = await fetch(`/api/heroes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(heroData),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при обновлении данных о герое');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при обновлении героя с ID ${id}:`, error);
    throw error;
  }
}

/**
 * Удаление героя
 */
export async function deleteHero(id: string) {
  try {
    const response = await fetch(`/api/heroes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при удалении героя');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при удалении героя с ID ${id}:`, error);
    throw error;
  }
} 