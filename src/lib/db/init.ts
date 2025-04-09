import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql as drizzleSql } from 'drizzle-orm';

export async function initDB() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Переменная окружения DATABASE_URL не задана. Проверьте файл .env');
  }
  
  // Опции для повторных попыток
  const maxRetries = 3;
  let retryCount = 0;
  let lastError;
  
  while (retryCount < maxRetries) {
    try {
      console.log(`Попытка инициализации базы данных (${retryCount + 1}/${maxRetries})...`);
      
      // Создаем клиент Neon
      // @ts-ignore - игнорируем ошибку типов, параметр не существует в типах
      const neonClient = neon(process.env.DATABASE_URL);
      const db = drizzle(neonClient);
      
      // Проверяем соединение простым запросом
      console.log('Проверка соединения с базой данных...');
      await db.execute(drizzleSql`SELECT 1`);
      console.log('Соединение с базой данных установлено успешно.');
      
      console.log('Начинаем инициализацию таблиц...');
      
      // Создаем таблицу heroes, если она не существует
      await db.execute(drizzleSql`
        CREATE TABLE IF NOT EXISTS heroes (
          id SERIAL PRIMARY KEY,
          last_name TEXT NOT NULL,
          first_name TEXT NOT NULL,
          middle_name TEXT,
          birth_year INTEGER,
          death_year INTEGER,
          awards TEXT,
          school TEXT NOT NULL,
          class TEXT NOT NULL,
          added_by TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Создаем таблицу schools, если она не существует
      await db.execute(drizzleSql`
        CREATE TABLE IF NOT EXISTS schools (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Создаем таблицу moderation для героев на модерации
      await db.execute(drizzleSql`
        CREATE TABLE IF NOT EXISTS heroes_moderation (
          id SERIAL PRIMARY KEY,
          last_name TEXT NOT NULL,
          first_name TEXT NOT NULL,
          middle_name TEXT,
          birth_year INTEGER,
          death_year INTEGER,
          awards TEXT,
          school TEXT NOT NULL,
          class TEXT NOT NULL,
          added_by TEXT NOT NULL,
          is_new_school BOOLEAN DEFAULT FALSE,
          telegram_message_id TEXT,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Добавляем лицей №87 в таблицу школ, если он еще не существует
      await db.execute(drizzleSql`
        INSERT INTO schools (name) 
        VALUES ('Лицей №87') 
        ON CONFLICT (name) DO NOTHING;
      `);
      
      console.log('База данных успешно инициализирована');
      return { 
        success: true, 
        message: 'База данных успешно инициализирована',
        tables: ['heroes', 'schools', 'heroes_moderation']
      };
    } catch (error) {
      lastError = error;
      console.error(`Ошибка при инициализации базы данных (попытка ${retryCount + 1}/${maxRetries}):`, error);
      
      // Увеличиваем счетчик попыток
      retryCount++;
      
      // Ждем перед следующей попыткой (увеличиваем время с каждой попыткой)
      if (retryCount < maxRetries) {
        const waitTime = retryCount * 2000; // 2 секунды, 4 секунды, 6 секунд...
        console.log(`Ожидание ${waitTime}мс перед следующей попыткой...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  // Если все попытки неудачны, выводим подробную информацию об ошибке
  console.error('Все попытки подключения к базе данных не удались.');
  console.error('Последняя ошибка:', lastError);
  console.error('URL подключения (без пароля):', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'));
  
  throw new Error('Не удалось подключиться к базе данных после нескольких попыток');
} 