import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

// Таблица для хранения героев
export const heroes = pgTable('heroes', {
  id: serial('id').primaryKey(),
  lastName: text('last_name').notNull(),
  firstName: text('first_name').notNull(),
  middleName: text('middle_name'),
  birthYear: integer('birth_year'),
  deathYear: integer('death_year'),
  awards: text('awards'),
  school: text('school').notNull(),
  class: text('class').notNull(),
  addedBy: text('added_by').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Таблица для хранения школ
export const schools = pgTable('schools', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow()
});

// Таблица для хранения героев на модерации
export const heroesModeration = pgTable('heroes_moderation', {
  id: serial('id').primaryKey(),
  lastName: text('last_name').notNull(),
  firstName: text('first_name').notNull(),
  middleName: text('middle_name'),
  birthYear: integer('birth_year'),
  deathYear: integer('death_year'),
  awards: text('awards'),
  school: text('school').notNull(),
  class: text('class').notNull(),
  addedBy: text('added_by').notNull(),
  isNewSchool: boolean('is_new_school').default(false),
  telegramMessageId: text('telegram_message_id'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow()
}); 