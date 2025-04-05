'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaMedal, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { getHeroes } from '@/api/heroesApi';
import { Hero } from '@/types';
import HeroCard from './HeroCard';

export default function HeroesList() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    region: '',
    rank: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const regions = [
    'Москва', 
    'Санкт-Петербург (Ленинград)', 
    'Волгоград (Сталинград)', 
    'Курская область',
    'Белгородская область',
    'Новгородская область',
    'Другие регионы'
  ];
  
  const ranks = [
    'Рядовой',
    'Сержант',
    'Лейтенант',
    'Капитан',
    'Майор',
    'Полковник',
    'Генерал'
  ];

  useEffect(() => {
    const fetchHeroes = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchQuery,
          region: filters.region,
          rank: filters.rank
        };
        
        const data = await getHeroes(params);
        setHeroes(data);
      } catch (error) {
        console.error('Ошибка при загрузке героев:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, [searchQuery, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Поиск выполняется автоматически через useEffect
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ region: '', rank: '' });
    setSearchQuery('');
  };

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
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Герои Великой Отечественной войны
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto">
          Сохраним память о подвигах наших предков. Здесь собраны истории о героях, 
          которые защищали нашу Родину в годы Великой Отечественной войны.
        </p>
      </motion.div>

      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <form onSubmit={handleSearch} className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени, званию или описанию"
            className="w-full bg-card border border-border rounded-full px-5 py-3 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          >
            <FaFilter />
          </button>
        </form>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-gray-400 mb-2 text-sm flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary-light" /> Регион
              </label>
              <select
                name="region"
                value={filters.region}
                onChange={handleFilterChange}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Все регионы</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2 text-sm flex items-center">
                <FaUser className="mr-2 text-primary-light" /> Воинское звание
              </label>
              <select
                name="rank"
                value={filters.rank}
                onChange={handleFilterChange}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Все звания</option>
                {ranks.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : heroes.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {heroes.map((hero) => (
            <motion.div key={hero.id} variants={childVariants}>
              <HeroCard hero={hero} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 px-4"
        >
          <FaMedal className="text-gray-600 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Герои не найдены</h3>
          <p className="text-gray-400 mb-4">
            По вашему запросу не найдено ни одного героя. Попробуйте изменить параметры поиска.
          </p>
          <button
            onClick={clearFilters}
            className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-full transition-colors"
          >
            Сбросить фильтры
          </button>
        </motion.div>
      )}
    </div>
  );
} 