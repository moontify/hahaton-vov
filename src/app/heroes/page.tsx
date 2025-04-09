import React from 'react';
import { Metadata } from 'next';
import PageHeader from '@/components/ui/PageHeader';
import HeroesSearch from '@/components/heroes/HeroesSearch';
import AddHeroForm from '@/components/heroes/AddHeroForm';
import { FaInfoCircle, FaUserShield, FaSync } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Герои Великой Отечественной Войны - Поиск и добавление',
  description: 'Поиск информации о героях ВОВ и возможность добавить героя в нашу базу данных.',
};

// Скрипт для проверки localStorage
const HeroesPageScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            // Проверяем localStorage на наличие героев
            const storedHeroes = localStorage.getItem('heroes');
            if (storedHeroes) {
              const heroes = JSON.parse(storedHeroes);
              
              // Проверяем, есть ли героев с id > 5 (добавленные пользователем)
              const userAddedHeroes = heroes.filter(hero => parseInt(hero.id) > 5);
              if (userAddedHeroes.length > 0) {
                
                // Добавляем индикатор на страницу
                const indicator = document.createElement('div');
                indicator.style.position = 'fixed';
                indicator.style.bottom = '20px';
                indicator.style.right = '20px';
                indicator.style.background = '#fbbf24';
                indicator.style.color = '#1f2937';
                indicator.style.padding = '10px 20px';
                indicator.style.borderRadius = '8px';
                indicator.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                indicator.style.zIndex = '9999';
                indicator.style.fontWeight = 'bold';
                indicator.textContent = 'Герои загружены успешно!';
                
                document.body.appendChild(indicator);
                
                // Убираем индикатор через 5 секунд
                setTimeout(() => {
                  indicator.remove();
                }, 5000);
              }
            }
          } catch (error) {
            console.error('Ошибка при проверке героев в localStorage:', error);
          }
        `
      }}
    />
  );
};

export default function HeroesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Герои Великой Отечественной Войны" 
        description="Поиск и добавление информации о героях Великой Отечественной войны"
        bgImage="/images/heroes-bg.jpg"
      />
      
      <div className="mt-8">
        <HeroesSearch />
        
        <div className="my-10 border-t border-gray-700"></div>
        
        <AddHeroForm />
      </div>
    </main>
  );
} 