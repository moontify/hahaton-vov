"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaMedal, FaMapMarkerAlt, FaUserShield, FaExclamationTriangle } from 'react-icons/fa';
import { useAppContext } from '@/contexts/AppContext';
import { getHeroes } from '@/api/heroesApi';
import { Hero } from '@/types';

const HeroesGrid: React.FC = () => {
  const { heroFilters, isLoading, setIsLoading } = useAppContext();
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHeroes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getHeroes(heroFilters);
        console.log('Загружено героев:', data.length);
        setHeroes(data);
      } catch (error) {
        console.error('Ошибка при загрузке героев:', error);
        setError('Не удалось загрузить данные о героях');
      } finally {
        setIsLoading(false);
      }
    };
    loadHeroes();
  }, [heroFilters, setIsLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Функция для проверки, является ли URL data URL
  const isDataUrl = (url: string) => url.startsWith('data:');

  // Для демонстрационной версии считаем, что герои с id > 5 были добавлены текущим пользователем
  const isUserAddedHero = (heroId: string) => parseInt(heroId) > 5;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 shadow-lg mb-8 border border-gray-700/50">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
          <FaMedal className="mr-3 text-amber-500" size={24} /> Герои Великой Отечественной Войны
        </h2>
        <p className="text-gray-300">
          Найдено героев: <span className="font-bold text-amber-500 text-lg">{heroes.length}</span>
        </p>
        <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
          <p className="text-amber-400 text-sm">
            <strong>Демо-режим:</strong> Данные о героях загружаются из локального хранилища браузера.
            В полной версии информация будет храниться в базе данных проекта.
          </p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-4 mb-8 flex items-start gap-4">
          <div className="text-red-500 pt-1">
            <FaExclamationTriangle size={20} />
          </div>
          <div>
            <h3 className="text-red-400 font-bold mb-1">Ошибка загрузки данных</h3>
            <p className="text-gray-300 text-sm">{error}</p>
            <button 
              onClick={() => getHeroes(heroFilters).then(data => setHeroes(data))}
              className="mt-2 text-red-400 underline text-sm hover:text-red-300"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {heroes.length > 0 ? (
            heroes.map(hero => (
              <motion.div 
                key={hero.id}
                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-500 border border-gray-700/50 relative"
                variants={childVariants}
                whileHover={{ y: -5 }}
              >
                {isUserAddedHero(hero.id) && (
                  <div className="absolute left-0 top-3 z-30 bg-blue-800/80 backdrop-blur-sm text-white py-1 px-3 rounded-r-full flex items-center text-xs font-medium">
                    <FaUserShield className="mr-1.5" /> Виден только вам
                  </div>
                )}
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10"></div>
                  <div className="relative w-full h-full group">
                    {hero.photo ? (
                      <Image 
                        src={isDataUrl(hero.photo) ? hero.photo : (hero.photo !== '/images/heroes/placeholder.jpg' ? hero.photo : 'https://images.unsplash.com/photo-1590090040957-3a33ca95013a?q=80&w=987&auto=format&fit=crop')}
                        alt={hero.name} 
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized={isDataUrl(hero.photo)} // Не оптимизировать data URL
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">Фото героя</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-black/50 backdrop-blur-sm text-amber-400 text-xs px-3 py-1 rounded-full">
                        {hero.years}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-gray-900 to-transparent">
                    <h3 className="text-2xl font-bold text-white mb-1">{hero.name}</h3>
                    <p className="text-amber-400 font-medium">{hero.rank}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hero.awards.map((award, idx) => (
                      <span 
                        key={`${hero.id}-${idx}`}
                        className="bg-gradient-to-r from-amber-900/40 to-amber-800/30 backdrop-blur-sm text-amber-300 text-xs px-3 py-1.5 rounded-full flex items-center"
                      >
                        <FaMedal className="mr-1.5 text-amber-500" /> {award}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{hero.description}</p>
                  <div className="flex items-center text-gray-400 text-sm pt-2 border-t border-gray-700/50">
                    <FaMapMarkerAlt className="mr-2 text-red-400" />
                    <span>{hero.region || 'Неизвестный регион'}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700/30">
              <p className="text-gray-400 text-lg mb-2">Героев по заданным критериям не найдено</p>
              <p className="text-amber-500/70 text-sm mb-4">
                Вы можете добавить информацию о своем родственнике-герое, используя форму ниже
              </p>
              <div className="max-w-md mx-auto p-4 bg-red-900/20 border border-red-800/30 rounded-lg mt-4">
                <p className="text-red-300 text-sm">
                  <strong>Важно:</strong> После добавления героя необходимо обновить страницу, чтобы увидеть его в галерее. 
                  Если вы уже добавили информацию, и не видите её, нажмите <button 
                    onClick={() => window.location.reload()} 
                    className="underline text-red-400 hover:text-red-300"
                  >
                    обновить страницу
                  </button>
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default HeroesGrid; 