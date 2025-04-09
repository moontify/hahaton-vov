import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Настройка параметров подключения
neonConfig.fetchConnectionCache = true;
// Попытаемся установить таймаут
try {
  // @ts-ignore - игнорируем ошибку типов для параметра, который может не существовать в типах
  neonConfig.fetchTimeout = 30000; // увеличиваем таймаут до 30 секунд
} catch (e) {
  console.warn('Невозможно установить fetchTimeout для neonConfig');
}

// Проверяем наличие переменной окружения и выводим информативное сообщение
if (!process.env.DATABASE_URL) {
  console.error('ОШИБКА: Переменная окружения DATABASE_URL не задана. Проверьте файл .env.local');
}

// Используем переменную окружения для подключения к базе данных
const connectionString = process.env.DATABASE_URL || 'postgres://fake:fake@localhost:5432/fake';

// Создаем SQL клиент и Drizzle подключение с обработкой ошибок
let db: NeonHttpDatabase<typeof schema>;
try {
  const sql = neon(connectionString);
  db = drizzle(sql, { schema });
  console.log('Подключение к базе данных успешно инициализировано');
} catch (error) {
  console.error('Ошибка при инициализации подключения к базе данных:', error);
  // Используем заглушку с правильной типизацией
  db = {} as NeonHttpDatabase<typeof schema>;
  console.warn('Использование заглушки для базы данных - приложение может работать некорректно');
}

export { db }; 