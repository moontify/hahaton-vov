'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaSave, FaUser, FaMedal, FaRegCalendarAlt, FaMapMarkerAlt, FaStar, FaCheck } from 'react-icons/fa';
import { addHero } from '@/api/heroesApi';
import { HeroFormData } from '@/types';
const initialFormData: HeroFormData = {
  fullName: '',
  birthYear: '',
  deathYear: '',
  rank: '',
  region: '',
  awards: '',
  description: '',
  contactName: '',
  contactEmail: '',
  contactRelation: '',
  photo: null,
};
export default function HeroesAddForm() {
  const [formData, setFormData] = useState<HeroFormData>(initialFormData);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };
  const handleBlur = () => {
    setFocusedField(null);
  };
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
        setFormData((prev) => ({ ...prev, photo: file }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const heroData = {
        name: formData.fullName,
        rank: formData.rank,
        region: formData.region,
        description: formData.description,
        years: `${formData.birthYear}-${formData.deathYear || 'наст. время'}`,
        awards: formData.awards.split(',').map(award => award.trim()),
        photo: formData.photo ? URL.createObjectURL(formData.photo) : '/images/heroes/placeholder.jpg'
      };
      await addHero(heroData);
      setSubmitStatus('success');
      setFormData(initialFormData);
      setPhotoPreview(null);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Ошибка при отправке данных:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };
  const ranks = [
    'Рядовой',
    'Ефрейтор',
    'Младший сержант',
    'Сержант',
    'Старший сержант',
    'Старшина',
    'Прапорщик',
    'Младший лейтенант',
    'Лейтенант',
    'Старший лейтенант',
    'Капитан',
    'Майор',
    'Подполковник',
    'Полковник',
    'Генерал-майор',
    'Генерал-лейтенант',
    'Генерал-полковник',
    'Генерал армии',
    'Маршал рода войск',
    'Маршал Советского Союза',
  ];
  const regions = [
    'Москва',
    'Санкт-Петербург (Ленинград)',
    'Волгоград (Сталинград)',
    'Курская область',
    'Белгородская область',
    'Новгородская область',
    'Смоленская область',
    'Тверская область',
    'Ростовская область',
    'Московская область',
    'Другие регионы',
  ];
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };
  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(178, 34, 34, 0.3)",
    },
    tap: { scale: 0.98 },
    disabled: { 
      opacity: 0.7,
      scale: 1,
      boxShadow: "none"
    }
  };
  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };
  const StarDecoration = ({ top, right, size, delay }: { top: string, right: string, size: number, delay: number }) => (
    <motion.div
      className="absolute text-amber-500/20 pointer-events-none z-0"
      style={{ top, right }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ 
        opacity: [0, 1, 0.5, 1, 0], 
        scale: [0, 1, 0.8, 1, 0],
        rotate: [0, 45, 0, -45, 0]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 5, 
        delay,
        ease: "easeInOut" 
      }}
    >
      <FaStar style={{ width: size, height: size }} />
    </motion.div>
  );
  return (
    <motion.div
      className="relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {}
      <StarDecoration top="5%" right="5%" size={30} delay={0} />
      <StarDecoration top="50%" right="3%" size={24} delay={1.5} />
      <StarDecoration top="80%" right="10%" size={20} delay={0.8} />
      <StarDecoration top="20%" right="15%" size={16} delay={2} />
      {submitStatus === 'success' ? (
        <motion.div 
          className="bg-gradient-to-r from-green-800/50 to-green-600/50 rounded-xl p-10 text-center"
          variants={successVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center mx-auto mb-6"
          >
            <FaCheck className="text-white" size={32} />
          </motion.div>
          <h3 className="text-2xl font-bold mb-4 text-white">Данные успешно отправлены</h3>
          <p className="text-gray-200 mb-6">
            Благодарим вас за сохранение исторической памяти! Информация о вашем родственнике будет опубликована после проверки модератором.
          </p>
          <motion.button
            className="bg-gradient-to-r from-primary to-primary-light text-white px-8 py-3 rounded-full shadow-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSubmitStatus('idle')}
          >
            Добавить еще одного героя
          </motion.button>
        </motion.div>
      ) : (
        <motion.form 
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-8 shadow-xl border border-gray-700"
        >
          <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Информация о родственнике-участнике ВОВ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {}
            <motion.div 
              className="space-y-4"
              variants={childVariants}
            >
              <div className="relative">
                <label className="block text-gray-300 mb-2 text-sm flex items-center">
                  <FaUser className="mr-2 text-primary-light" /> ФИО участника войны
                </label>
                <motion.input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('fullName')}
                  onBlur={handleBlur}
                  animate={focusedField === 'fullName' ? { scale: 1.02 } : { scale: 1 }}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Например: Иванов Иван Иванович"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-gray-300 mb-2 text-sm flex items-center">
                    <FaRegCalendarAlt className="mr-2 text-primary-light" /> Год рождения
                  </label>
                  <motion.input
                    type="number"
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('birthYear')}
                    onBlur={handleBlur}
                    animate={focusedField === 'birthYear' ? { scale: 1.02 } : { scale: 1 }}
                    min="1870"
                    max="1945"
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="1900"
                  />
                </div>
                <div className="relative">
                  <label className="block text-gray-300 mb-2 text-sm flex items-center">
                    <FaRegCalendarAlt className="mr-2 text-primary-light" /> Год смерти
                  </label>
                  <motion.input
                    type="number"
                    name="deathYear"
                    value={formData.deathYear}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('deathYear')}
                    onBlur={handleBlur}
                    animate={focusedField === 'deathYear' ? { scale: 1.02 } : { scale: 1 }}
                    min="1941"
                    max={new Date().getFullYear().toString()}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Если жив, оставьте пустым"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 text-sm flex items-center">
                  <FaMedal className="mr-2 text-primary-light" /> Воинское звание
                </label>
                <motion.select
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('rank')}
                  onBlur={handleBlur}
                  animate={focusedField === 'rank' ? { scale: 1.02 } : { scale: 1 }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Выберите звание</option>
                  {ranks.map((rank) => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </motion.select>
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 text-sm flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-primary-light" /> Регион/населенный пункт
                </label>
                <motion.select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('region')}
                  onBlur={handleBlur}
                  animate={focusedField === 'region' ? { scale: 1.02 } : { scale: 1 }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Выберите регион</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </motion.select>
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 text-sm flex items-center">
                  <FaMedal className="mr-2 text-primary-light" /> Награды (через запятую)
                </label>
                <motion.input
                  type="text"
                  name="awards"
                  value={formData.awards}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('awards')}
                  onBlur={handleBlur}
                  animate={focusedField === 'awards' ? { scale: 1.02 } : { scale: 1 }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Например: Орден Красной Звезды, Медаль 'За отвагу'"
                />
              </div>
            </motion.div>
            {}
            <motion.div 
              className="space-y-4"
              variants={childVariants}
            >
              <div className="relative mb-4">
                <label className="block text-gray-300 mb-2 text-sm">Фотография (если есть)</label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors bg-gray-800/50 overflow-hidden">
                  {photoPreview ? (
                    <div className="relative w-full h-48 mb-2">
                      <img 
                        src={photoPreview}
                        alt="Предпросмотр" 
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setFormData(prev => ({ ...prev, photo: null }));
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <FaUpload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-gray-400 mb-2">Нажмите для загрузки или перетащите файл</p>
                      <p className="text-gray-500 text-xs">JPG, PNG или GIF, максимум 5 МБ</p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="photo"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 text-sm">Краткое описание (подвиги, история)</label>
                <motion.textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('description')}
                  onBlur={handleBlur}
                  animate={focusedField === 'description' ? { scale: 1.02 } : { scale: 1 }}
                  rows={5}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Опишите боевой путь, подвиги, интересные факты из жизни героя"
                />
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 text-sm">Ваше имя</label>
                <motion.input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('contactName')}
                  onBlur={handleBlur}
                  animate={focusedField === 'contactName' ? { scale: 1.02 } : { scale: 1 }}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 text-sm">Ваш email для связи</label>
                <motion.input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('contactEmail')}
                  onBlur={handleBlur}
                  animate={focusedField === 'contactEmail' ? { scale: 1.02 } : { scale: 1 }}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 text-sm">Кем вам приходится герой</label>
                <motion.input
                  type="text"
                  name="contactRelation"
                  value={formData.contactRelation}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('contactRelation')}
                  onBlur={handleBlur}
                  animate={focusedField === 'contactRelation' ? { scale: 1.02 } : { scale: 1 }}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Например: дедушка, прадед"
                />
              </div>
            </motion.div>
          </div>
          <motion.div
            className="text-center"
            variants={childVariants}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`bg-gradient-to-r from-primary to-primary-light text-white px-8 py-3 rounded-full shadow-lg font-semibold flex items-center justify-center mx-auto min-w-[200px] ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              variants={buttonVariants}
              whileHover={isSubmitting ? "disabled" : "hover"}
              whileTap={isSubmitting ? "disabled" : "tap"}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправка...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Сохранить информацию
                </>
              )}
            </motion.button>
            {submitStatus === 'error' && (
              <motion.p 
                className="text-red-400 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.
              </motion.p>
            )}
          </motion.div>
        </motion.form>
      )}
    </motion.div>
  );
} 