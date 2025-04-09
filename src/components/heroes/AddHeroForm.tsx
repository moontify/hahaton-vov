'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaUserAlt, FaSchool, FaMedal, FaRegCalendarAlt, FaCheckCircle, FaExclamationCircle, FaShieldAlt, FaPlus } from 'react-icons/fa';

interface HeroFormData {
  lastName: string;
  firstName: string;
  middleName: string;
  birthYear: string;
  deathYear: string;
  awards: string;
  school: string;
  customSchool: string;
  class: string;
  addedBy: string;
}

const AddHeroForm: React.FC = () => {
  const [formData, setFormData] = useState<HeroFormData>({
    lastName: '',
    firstName: '',
    middleName: '',
    birthYear: '',
    deathYear: '',
    awards: '',
    school: '',
    customSchool: '',
    class: '',
    addedBy: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isCustomSchool, setIsCustomSchool] = useState(false);
  const customSchoolRef = useRef<HTMLInputElement>(null);
  const [schools, setSchools] = useState<string[]>(['Лицей №87']);
  const [loadingSchools, setLoadingSchools] = useState(false);
  
  // Загрузка списка школ с сервера
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoadingSchools(true);
        const response = await fetch('/api/schools');
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.schools)) {
            // Устанавливаем школы напрямую из массива, так как API возвращает просто массив строк
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
  
  // Эффект для фокуса на поле ввода своей школы
  useEffect(() => {
    if (isCustomSchool && customSchoolRef.current) {
      customSchoolRef.current.focus();
    }
  }, [isCustomSchool]);
  
  const handleInputChange = (key: keyof HeroFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Если выбрали "Добавить свою школу" в селекте школ
    if (key === 'school' && value === 'custom') {
      setIsCustomSchool(true);
    } else if (key === 'school') {
      setIsCustomSchool(false);
    }
  };
  
  const handleReset = () => {
    setFormData({
      lastName: '',
      firstName: '',
      middleName: '',
      birthYear: '',
      deathYear: '',
      awards: '',
      school: '',
      customSchool: '',
      class: '',
      addedBy: '',
    });
    setError('');
    setSuccess(false);
    setIsCustomSchool(false);
  };
  
  const validateForm = () => {
    if (!formData.lastName.trim()) return 'Фамилия героя обязательна';
    if (!formData.firstName.trim()) return 'Имя героя обязательно';
    
    if (isCustomSchool) {
      if (!formData.customSchool.trim()) return 'Укажите название вашей школы';
    } else if (!formData.school.trim() || formData.school === 'custom') {
      return 'Выберите школу';
    }
    
    if (!formData.class.trim()) return 'Выберите класс';
    if (!formData.addedBy.trim()) return 'Укажите, кто добавил запись';
    
    if (formData.birthYear && isNaN(Number(formData.birthYear))) {
      return 'Год рождения должен быть числом';
    }
    
    if (formData.deathYear && isNaN(Number(formData.deathYear))) {
      return 'Год смерти должен быть числом';
    }
    
    return '';
  };
  
  const addHero = async () => {
    // Проверяем форму на ошибки
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      
      // Преобразуем годы из строк в числа, если они указаны
      // И устанавливаем правильную школу в зависимости от выбора
      const finalSchool = isCustomSchool ? formData.customSchool : formData.school;
      
      const heroData = {
        ...formData,
        birthYear: formData.birthYear ? parseInt(formData.birthYear) : undefined,
        deathYear: formData.deathYear ? parseInt(formData.deathYear) : undefined,
        school: finalSchool,
        // Добавляем флаг, указывающий на новую школу, для телеграм-бота
        isNewSchool: isCustomSchool
      };
      
      // Отправляем запрос на создание героя
      const response = await fetch('/api/heroes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Ошибка: ${response.status}`);
      }
      
      // Если всё хорошо, показываем сообщение об успехе и очищаем форму
      setSuccess(true);
      handleReset();
      
      // Прокручиваем страницу к сообщению об успехе
      setTimeout(() => {
        window.scrollTo({
          top: document.getElementById('success-message')?.offsetTop || 0,
          behavior: 'smooth'
        });
      }, 100);
      
    } catch (err) {
      setError('Ошибка при добавлении героя: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Ошибка добавления:', err);
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
  
  const inputVariants = {
    focus: { 
      scale: 1.01,
      borderColor: '#f59e0b',
      boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.2)',
      transition: { duration: 0.2 }
    }
  };
  
  const buttonVariants = {
    hover: { 
      scale: 1.03, 
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.97,
      boxShadow: '0 0 0 rgba(0,0,0,0.2)',
      transition: { duration: 0.1 }
    }
  };
  
  const successVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1,
      height: 'auto',
      transition: { 
        height: { duration: 0.4 },
        opacity: { duration: 0.3, delay: 0.1 }
      }
    },
    exit: { 
      opacity: 0,
      height: 0,
      transition: { 
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    }
  };
  
  const loadingVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };
  
  const heroEntryAnimation = {
    initial: { y: 30, opacity: 0 },
    animate: (index: number) => ({ 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: 0.1 * index,
        duration: 0.4
      }
    })
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
      className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-lg p-6 shadow-lg mb-8"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-amber-600 text-white p-3 rounded-full mr-4">
          <FaUserPlus size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white">Добавить героя ВОВ</h2>
      </motion.div>
      
      <AnimatePresence>
        {success && (
          <motion.div 
            id="success-message"
            className="mb-8 p-6 rounded-lg bg-gradient-to-r from-green-800/60 to-green-900/60 border border-green-700"
            variants={successVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-green-700 p-3 rounded-full">
                <FaCheckCircle className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-300 mb-2">Запись успешно добавлена!</h3>
                <p className="text-green-200/90 mb-3">
                  Ваша запись о герое отправлена на модерацию. После проверки она будет доступна в общем списке героев.
                  {isCustomSchool && (
                    <span className="block mt-1 font-semibold">
                      Добавленная школа &quot;{formData.customSchool}&quot; также будет проверена и добавлена в общий список после модерации.
                    </span>
                  )}
                </p>
                <div className="flex items-start mt-3 border-t border-green-700/50 pt-3">
                  <FaShieldAlt className="text-amber-400 mt-1 mr-2" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-amber-400">Процесс модерации:</strong> Записи проверяются историками и модераторами для подтверждения достоверности информации. Обычно проверка занимает 1-3 рабочих дня. Модератор получит уведомление в Telegram о вашей записи. Благодарим за ваш вклад в сохранение исторической памяти!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {error && (
        <motion.div 
          className="mb-6 text-red-500 bg-red-900/20 border border-red-900/50 p-4 rounded-md flex items-start gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaExclamationCircle className="mt-1 flex-shrink-0" />
          <div>{error}</div>
        </motion.div>
      )}
      
      <motion.div className="bg-gray-900/30 p-6 rounded-lg border border-gray-700 backdrop-blur-sm">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, staggerChildren: 0.1 }}
        >
          <motion.div 
            custom={0}
            variants={heroEntryAnimation}
            initial="initial"
            animate="animate"
          >
            <label className="block text-gray-300 mb-2 flex items-center text-sm">
              <FaUserAlt className="mr-2 text-amber-500" />
              Фамилия <span className="text-red-500 ml-1">*</span>
            </label>
            <motion.input
              type="text"
              placeholder="Фамилия героя"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>
          
          <motion.div 
            custom={1}
            variants={heroEntryAnimation}
            initial="initial"
            animate="animate"
          >
            <label className="block text-gray-300 mb-2 flex items-center text-sm">
              <FaUserAlt className="mr-2 text-amber-500" />
              Имя <span className="text-red-500 ml-1">*</span>
            </label>
            <motion.input
              type="text"
              placeholder="Имя героя"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>
          
          <motion.div 
            custom={2}
            variants={heroEntryAnimation}
            initial="initial"
            animate="animate"
          >
            <label className="block text-gray-300 mb-2 flex items-center text-sm">
              <FaUserAlt className="mr-2 text-amber-500" />
              Отчество
            </label>
            <motion.input
              type="text"
              placeholder="Отчество героя"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700"
              value={formData.middleName}
              onChange={(e) => handleInputChange('middleName', e.target.value)}
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          <motion.div 
            custom={3}
            variants={heroEntryAnimation}
            initial="initial"
            animate="animate"
          >
            <label className="block text-gray-300 mb-2 flex items-center text-sm">
              <FaRegCalendarAlt className="mr-2 text-amber-500" />
              Год рождения
            </label>
            <motion.input
              type="number"
              min="1870"
              max="1945"
              placeholder="Например: 1920"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700"
              value={formData.birthYear}
              onChange={(e) => handleInputChange('birthYear', e.target.value)}
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>
          
          <motion.div 
            custom={4}
            variants={heroEntryAnimation}
            initial="initial"
            animate="animate"
          >
            <label className="block text-gray-300 mb-2 flex items-center text-sm">
              <FaRegCalendarAlt className="mr-2 text-amber-500" />
              Год смерти
            </label>
            <motion.input
              type="number"
              min="1941"
              max="1945"
              placeholder="Например: 1943"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700"
              value={formData.deathYear}
              onChange={(e) => handleInputChange('deathYear', e.target.value)}
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mb-6"
          custom={5}
          variants={heroEntryAnimation}
          initial="initial"
          animate="animate"
        >
          <label className="block text-gray-300 mb-2 flex items-center text-sm">
            <FaMedal className="mr-2 text-amber-500" />
            Награды
          </label>
          <motion.select
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700"
            value={formData.awards}
            onChange={(e) => handleInputChange('awards', e.target.value)}
            whileFocus="focus"
            variants={inputVariants}
          >
            <option value="">Выберите награду</option>
            {awardsList.map(award => (
              <option key={award} value={award}>{award}</option>
            ))}
          </motion.select>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, staggerChildren: 0.1 }}
        >
          <motion.div 
            custom={6}
            variants={heroEntryAnimation}
            initial="initial"
            animate="animate"
          >
            <label className="block text-gray-300 mb-2 flex items-center text-sm">
              <FaSchool className="mr-2 text-amber-500" />
              Школа <span className="text-red-500 ml-1">*</span>
            </label>
            <motion.select
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700"
              value={formData.school}
              onChange={(e) => handleInputChange('school', e.target.value)}
              whileFocus="focus"
              variants={inputVariants}
              disabled={loadingSchools}
            >
              <option value="">
                {loadingSchools ? 'Загрузка школ...' : 'Выберите школу'}
              </option>
              {schools.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
              <option value="custom" className="text-amber-400">
                Добавить свою школу
              </option>
            </motion.select>
            
            <AnimatePresence>
              {isCustomSchool && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3"
                >
                  <motion.div
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    className="relative"
                  >
                    <label className="block text-amber-400 mb-2 flex items-center text-sm">
                      <FaPlus className="mr-2 text-amber-500" />
                      Введите название вашей школы <span className="text-red-500 ml-1">*</span>
                    </label>
                    <motion.input
                      ref={customSchoolRef}
                      type="text"
                      placeholder="Например: Школа №123"
                      className="w-full bg-amber-500/10 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 border border-amber-700/50"
                      value={formData.customSchool}
                      onChange={(e) => handleInputChange('customSchool', e.target.value)}
                      whileFocus="focus"
                      variants={inputVariants}
                    />
                    <p className="text-gray-400 text-xs mt-2 italic">
                      Новая школа будет добавлена в список после модерации
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.div 
            custom={7}
            variants={heroEntryAnimation}
            initial="initial"
            animate="animate"
          >
            <label className="block text-gray-300 mb-2 flex items-center text-sm">
              <FaSchool className="mr-2 text-amber-500" />
              Класс <span className="text-red-500 ml-1">*</span>
            </label>
            <motion.select
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700"
              value={formData.class}
              onChange={(e) => handleInputChange('class', e.target.value)}
              whileFocus="focus"
              variants={inputVariants}
            >
              <option value="">Выберите класс</option>
              {classList.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </motion.select>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="mb-6"
          custom={8}
          variants={heroEntryAnimation}
          initial="initial"
          animate="animate"
        >
          <label className="block text-gray-300 mb-2 flex items-center text-sm">
            <FaUserAlt className="mr-2 text-amber-500" />
            Добавил ученик <span className="text-red-500 ml-1">*</span>
          </label>
          <motion.input
            type="text"
            placeholder="Имя Фамилия"
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700"
            value={formData.addedBy}
            onChange={(e) => handleInputChange('addedBy', e.target.value)}
            whileFocus="focus"
            variants={inputVariants}
          />
        </motion.div>
        
        <motion.div
          className="flex flex-wrap gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 flex items-center shadow-md"
            onClick={addHero}
            disabled={loading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {loading ? (
              <>
                <motion.span 
                  className="mr-2"
                  variants={loadingVariants}
                  animate="animate"
                >
                  ↻
                </motion.span>
                Сохранение...
              </>
            ) : (
              <>
                <FaUserPlus className="mr-2" />
                Добавить героя
              </>
            )}
          </motion.button>
          <motion.button
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 border border-gray-600"
            onClick={handleReset}
            disabled={loading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Очистить форму
          </motion.button>
        </motion.div>
        
        <motion.div
          className="mt-8 pt-6 border-t border-gray-700 text-gray-400 text-sm flex items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <FaShieldAlt className="text-amber-500 mt-1 mr-3 flex-shrink-0" />
          <p>
            <strong className="text-amber-400">Важно:</strong> Все добавленные записи проходят модерацию у историков и специалистов. Пожалуйста, указывайте достоверную информацию. После проверки запись будет опубликована в общем списке героев. Новые школы также будут добавлены в список после проверки модератором.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AddHeroForm; 