'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaUserAlt, FaSchool, FaMedal, FaRegCalendarAlt, FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericUp, FaStar } from 'react-icons/fa';

interface Hero {
  id: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  birthYear?: number;
  deathYear?: number;
  awards?: string;
  school: string;
  class: string;
  addedBy: string;
  createdAt: string;
}

interface HeroSearchForm {
  lastName: string;
  firstName: string;
  middleName: string;
  award: string;
  school: string;
  class: string;
  birthYear: string;
}

// Тип для параметров сортировки
type SortField = 'lastName' | 'birthYear' | 'school' | 'class' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const HeroesSearch: React.FC = () => {
  const [searchForm, setSearchForm] = useState<HeroSearchForm>({
    lastName: '',
    firstName: '',
    middleName: '',
    award: '',
    school: '',
    class: '',
    birthYear: '',
  });
  
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Добавляем состояние для списка школ
  const [schools, setSchools] = useState<string[]>(['Лицей №87']);
  const [loadingSchools, setLoadingSchools] = useState(false);
  
  // Состояние для сортировки
  const [sortField, setSortField] = useState<SortField>('lastName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Функция для загрузки всех героев
  const loadAllHeroes = async () => {
    try {
      setInitialLoading(true);
      setError('');
      
      const response = await fetch('/api/heroes');
      
      if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`);
      }
      
      const data = await response.json();
      setHeroes(sortHeroes(data, sortField, sortOrder));
    } catch (err) {
      setError('Ошибка при загрузке героев: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Ошибка загрузки:', err);
    } finally {
      setInitialLoading(false);
    }
  };
  
  // Загружаем всех героев при монтировании компонента
  useEffect(() => {
    loadAllHeroes();
  }, []);
  
  // Функция для загрузки списка школ
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoadingSchools(true);
        const response = await fetch('/api/schools');
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.schools)) {
            // Устанавливаем школы напрямую из массива
            setSchools(data.schools);
          }
        } else {
          console.error('Ошибка загрузки списка школ:', response.status);
        }
      } catch (error) {
        console.error('Ошибка при загрузке списка школ:', error);
      } finally {
        setLoadingSchools(false);
      }
    };
    
    fetchSchools();
  }, []);
  
  // Функция для сортировки героев
  const sortHeroes = (heroList: Hero[], field: SortField, order: SortOrder): Hero[] => {
    return [...heroList].sort((a, b) => {
      let valueA, valueB;
      
      // Получаем значения для сравнения
      switch (field) {
        case 'lastName':
          valueA = a.lastName.toLowerCase();
          valueB = b.lastName.toLowerCase();
          break;
        case 'birthYear':
          valueA = a.birthYear || 0;
          valueB = b.birthYear || 0;
          break;
        case 'school':
          valueA = a.school.toLowerCase();
          valueB = b.school.toLowerCase();
          break;
        case 'class':
          valueA = a.class.toLowerCase();
          valueB = b.class.toLowerCase();
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        default:
          valueA = a.lastName.toLowerCase();
          valueB = b.lastName.toLowerCase();
      }
      
      // Сортируем в зависимости от порядка
      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };
  
  // Функция для изменения поля сортировки
  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      // Если поле то же самое, меняем порядок
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Если поле новое, устанавливаем его и сбрасываем порядок на asc
      setSortField(field);
      setSortOrder('asc');
    }
    
    // Применяем сортировку к текущему списку героев
    setHeroes(sortHeroes(heroes, field, sortField === field && sortOrder === 'asc' ? 'desc' : 'asc'));
  };
  
  // Получаем иконку для заголовка колонки в зависимости от текущей сортировки
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    
    switch (field) {
      case 'birthYear':
        return sortOrder === 'asc' ? <FaSortNumericDown className="ml-1" /> : <FaSortNumericUp className="ml-1" />;
      default:
        return sortOrder === 'asc' ? <FaSortAlphaDown className="ml-1" /> : <FaSortAlphaUp className="ml-1" />;
    }
  };
  
  const handleInputChange = (key: keyof HeroSearchForm, value: string) => {
    setSearchForm(prev => ({ ...prev, [key]: value }));
  };
  
  const handleReset = () => {
    setSearchForm({
      lastName: '',
      firstName: '',
      middleName: '',
      award: '',
      school: '',
      class: '',
      birthYear: '',
    });
    loadAllHeroes();
  };
  
  const searchHeroes = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Создаем URL для запроса с параметрами
      const params = new URLSearchParams();
      
      if (searchForm.lastName) params.append('lastName', searchForm.lastName);
      if (searchForm.firstName) params.append('firstName', searchForm.firstName);
      if (searchForm.middleName) params.append('middleName', searchForm.middleName);
      if (searchForm.award) params.append('award', searchForm.award);
      if (searchForm.school) params.append('school', searchForm.school);
      if (searchForm.class) params.append('class', searchForm.class);
      if (searchForm.birthYear) params.append('birthYear', searchForm.birthYear);
      
      // Выполняем запрос к API
      const response = await fetch(`/api/heroes?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`);
      }
      
      const data = await response.json();
      setHeroes(sortHeroes(data, sortField, sortOrder));
      
    } catch (err) {
      setError('Ошибка при поиске героев: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Ошибка поиска:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
      transition: { duration: 0.1 }
    }
  };
  
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };
  
  const filtersVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3, type: "tween" }
    }
  };
  
  const loadingVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  const classList = [
    '1А', '1Б', '2А', '2Б', '3А', '3Б', 
    '4А', '4Б', '5А', '5Б', '6А', '6Б',
    '7А', '7Б', '8А', '8Б', '9А', '9Б',
    '10А', '10Б', '11А', '11Б', 'Учитель'
  ];
  
  const awardsList = [
    'Герой Советского Союза',
    'Орден Ленина',
    'Орден Красного Знамени',
    'Орден Красной Звезды',
    'Орден Отечественной Войны I степени',
    'Орден Отечественной Войны II степени',
    'Орден Славы I степени',
    'Орден Славы II степени',
    'Орден Славы III степени',
    'Медаль «За отвагу»',
    'Медаль «За боевые заслуги»',
    'Медаль «За оборону Ленинграда»',
    'Медаль «За оборону Москвы»',
    'Медаль «За оборону Сталинграда»',
  ];

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="text-2xl font-bold text-white mb-6 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FaSearch className="mr-2 text-amber-500" /> Поиск героев ВОВ
      </motion.h2>
      
      <div className="mb-6">
        <div className="relative">
          <div className="flex gap-2 mb-4">
            <motion.input
              type="text"
              placeholder="Введите фамилию героя для быстрого поиска..."
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchForm.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileFocus={{ scale: 1.01 }}
            />
            <motion.button
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 flex items-center"
              onClick={searchHeroes}
              disabled={loading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {loading ? (
                <>
                  <motion.span 
                    className="mr-2"
                    variants={loadingVariants}
                    animate="animate"
                  >↻</motion.span>
                  Загрузка...
                </>
              ) : (
                <>
                  <FaSearch className="mr-2" />
                  Найти
                </>
              )}
            </motion.button>
          </div>
          
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center text-sm ${showFilters ? 'text-amber-400' : 'text-gray-400'} hover:text-amber-300 transition-colors duration-200`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaFilter className="mr-1" /> {showFilters ? 'Скрыть расширенные фильтры' : 'Показать расширенные фильтры'}
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            variants={filtersVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden"
          >
            <div className="mb-6 border-t border-gray-700 pt-4 mt-2">
              <h3 className="text-amber-500 font-semibold mb-4">Расширенные фильтры</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center text-sm">
                    <FaUserAlt className="mr-2 text-amber-500" />
                    Имя
                  </label>
                  <input
                    type="text"
                    placeholder="Имя героя"
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={searchForm.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center text-sm">
                    <FaUserAlt className="mr-2 text-amber-500" />
                    Отчество
                  </label>
                  <input
                    type="text"
                    placeholder="Отчество героя"
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={searchForm.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center text-sm">
                    <FaRegCalendarAlt className="mr-2 text-amber-500" />
                    Год рождения
                  </label>
                  <input
                    type="number"
                    min="1870"
                    max="1945"
                    placeholder="Например: 1920"
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={searchForm.birthYear}
                    onChange={(e) => handleInputChange('birthYear', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center text-sm">
                    <FaSchool className="mr-2 text-amber-500" />
                    Школа
                  </label>
                  <select
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={searchForm.school}
                    onChange={(e) => handleInputChange('school', e.target.value)}
                    disabled={loadingSchools}
                  >
                    <option value="">
                      {loadingSchools ? 'Загрузка школ...' : 'Любая школа'}
                    </option>
                    {schools.map(school => (
                      <option key={school} value={school}>{school}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center text-sm">
                    <FaSchool className="mr-2 text-amber-500" />
                    Класс
                  </label>
                  <select
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={searchForm.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                  >
                    <option value="">Любой класс</option>
                    {classList.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center text-sm">
                    <FaMedal className="mr-2 text-amber-500" />
                    Награда
                  </label>
                  <select
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={searchForm.award}
                    onChange={(e) => handleInputChange('award', e.target.value)}
                  >
                    <option value="">Любая награда</option>
                    {awardsList.map(award => (
                      <option key={award} value={award}>{award}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <motion.button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 flex items-center"
                onClick={handleReset}
                disabled={loading || initialLoading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Сбросить фильтры
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="mt-4 text-red-500 bg-red-100/10 p-3 rounded-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {initialLoading ? (
        <motion.div 
          className="mt-8 text-center py-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="text-amber-500 text-5xl inline-block mb-4"
            variants={loadingVariants}
            animate="animate"
          >
            ↻
          </motion.div>
          <p className="text-gray-300 text-lg">Загрузка списка героев...</p>
        </motion.div>
      ) : heroes.length > 0 ? (
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <motion.h3 
              className="text-xl font-bold text-white flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaStar className="text-amber-500 mr-2" /> Список героев ({heroes.length})
            </motion.h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span>Сортировать по:</span>
              <motion.button 
                className={`flex items-center ${sortField === 'lastName' ? 'text-amber-500 font-semibold' : ''} hover:text-amber-400`}
                onClick={() => handleSortChange('lastName')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ФИО {getSortIcon('lastName')}
              </motion.button>
              <motion.button 
                className={`flex items-center ${sortField === 'birthYear' ? 'text-amber-500 font-semibold' : ''} hover:text-amber-400`}
                onClick={() => handleSortChange('birthYear')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Году рождения {getSortIcon('birthYear')}
              </motion.button>
              <motion.button 
                className={`flex items-center ${sortField === 'school' ? 'text-amber-500 font-semibold' : ''} hover:text-amber-400`}
                onClick={() => handleSortChange('school')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Школе {getSortIcon('school')}
              </motion.button>
              <motion.button 
                className={`flex items-center ${sortField === 'createdAt' ? 'text-amber-500 font-semibold' : ''} hover:text-amber-400`}
                onClick={() => handleSortChange('createdAt')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Дате добавления {getSortIcon('createdAt')}
              </motion.button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroes.map((hero, index) => (
              <motion.div 
                key={hero.id} 
                className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 backdrop-blur-sm"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                layout
              >
                <h4 className="text-lg font-bold text-white">
                  {hero.lastName} {hero.firstName} {hero.middleName || ''}
                </h4>
                <div className="mt-3 text-gray-300">
                  {hero.birthYear && hero.deathYear && (
                    <p className="flex items-center mb-2">
                      <FaRegCalendarAlt className="text-amber-500 mr-2" />
                      <strong>Годы жизни:</strong> <span className="ml-1">{hero.birthYear} - {hero.deathYear}</span>
                    </p>
                  )}
                  {hero.awards && (
                    <p className="flex items-start mb-2">
                      <FaMedal className="text-amber-500 mr-2 mt-1" />
                      <span><strong>Награды:</strong> {hero.awards}</span>
                    </p>
                  )}
                  <motion.div 
                    className="mt-3 pt-3 border-t border-gray-600 text-gray-400 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 * (index + 1) }}
                  >
                    <FaSchool className="inline-block mr-1 text-amber-500/70" /> Добавил: ученик {hero.class} класса {hero.school}, {hero.addedBy}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="mt-8 text-center py-12 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-300 text-lg">Герои не найдены. Попробуйте изменить параметры поиска или добавьте новых героев.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HeroesSearch; 