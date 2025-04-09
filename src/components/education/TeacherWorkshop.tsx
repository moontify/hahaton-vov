'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUserTie, FaUsers, FaExternalLinkAlt, FaPlayCircle, FaTimes } from 'react-icons/fa';

const TeacherWorkshop = () => {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('all');

  // Массив вебинаров и мастер-классов
  const workshops = [
    {
      id: 'ws1',
      title: 'Использование интерактивных технологий при изучении темы ВОВ',
      type: 'Вебинар',
      date: '2023-12-15',
      time: '15:00',
      duration: 90,
      speaker: 'Иванова Анна Петровна, канд. пед. наук, доцент МГУ',
      participants: 120,
      description: 'На вебинаре будут рассмотрены современные подходы к использованию интерактивных технологий при изучении Великой Отечественной войны. Будут представлены методики работы с виртуальными экскурсиями, 3D-моделями и интерактивными картами.',
      registrationLink: 'https://example.com/register/ws1',
      isPast: true,
      recordingUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'ws2',
      title: 'Проектная деятельность учащихся по теме "Великая Отечественная война"',
      type: 'Мастер-класс',
      date: '2025-05-20',
      time: '14:00',
      duration: 120,
      speaker: 'Петров Сергей Иванович, учитель истории высшей категории',
      participants: 85,
      description: 'Мастер-класс посвящен организации проектной деятельности учащихся по теме Великой Отечественной войны. Будут представлены различные типы проектов, критерии оценивания, примеры успешных работ учащихся.',
      registrationLink: 'https://example.com/register/ws2',
      isPast: false
    },
    {
      id: 'ws3',
      title: 'Патриотическое воспитание через изучение истории ВОВ',
      type: 'Круглый стол',
      date: '2025-02-10',
      time: '16:30',
      duration: 120,
      speaker: 'Модератор: Смирнова Елена Владимировна, эксперт в области воспитания',
      participants: 65,
      description: 'В рамках круглого стола будут обсуждаться вопросы патриотического воспитания молодежи через изучение истории Великой Отечественной войны. Приглашены эксперты в области образования, психологии и истории.',
      registrationLink: 'https://example.com/register/ws3',
      isPast: true,
      recordingUrl: 'https://www.youtube.com/embed/9bZkp7q19f0'
    },
    {
      id: 'ws4',
      title: 'Методика использования архивных материалов на уроках истории',
      type: 'Вебинар',
      date: '2025-06-05',
      time: '15:00',
      duration: 90,
      speaker: 'Козлов Андрей Михайлович, к.и.н., научный сотрудник Исторического музея',
      participants: 0,
      description: 'Вебинар познакомит учителей с методикой использования архивных материалов при изучении Великой Отечественной войны. Особое внимание будет уделено работе с письмами фронтовиков, дневниками и фотографиями военного времени.',
      registrationLink: 'https://example.com/register/ws4',
      isPast: false
    },
    {
      id: 'ws5',
      title: 'Цифровые инструменты для создания тематических уроков о ВОВ',
      type: 'Практикум',
      date: '2025-03-20',
      time: '14:30',
      duration: 150,
      speaker: 'Николаева Мария Александровна, EdTech эксперт',
      participants: 95,
      description: 'Практический семинар по использованию цифровых инструментов для создания тематических уроков о Великой Отечественной войне. Участники познакомятся с платформами для создания интерактивного контента, инфографики, тестов и квизов.',
      registrationLink: 'https://example.com/register/ws5',
      isPast: true,
      recordingUrl: 'https://www.youtube.com/embed/6Dh-RL__uN4'
    },
    {
      id: 'ws6',
      title: 'Интеграция материалов портала в школьную программу',
      type: 'Вебинар',
      date: '2025-08-25',
      time: '11:00',
      duration: 60,
      speaker: 'Разработчики портала и методисты',
      participants: 0,
      description: 'На вебинаре будут представлены возможности интеграции материалов нашего портала в школьную программу. Будут рассмотрены практические аспекты использования виртуальных туров, интерактивных хронологий и образовательных игр на уроках истории.',
      registrationLink: 'https://example.com/register/ws6',
      isPast: false
    }
  ];

  // Фильтрация вебинаров
  const filteredWorkshops = workshops.filter(workshop => {
    if (filter === 'upcoming') return !workshop.isPast;
    if (filter === 'past') return workshop.isPast;
    return true;
  });

  // Форматирование даты
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="py-4">
      {/* Фильтры */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-800 rounded-lg overflow-hidden">
          <button
            className={`px-6 py-3 ${filter === 'all' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setFilter('all')}
          >
            Все мероприятия
          </button>
          <button
            className={`px-6 py-3 ${filter === 'upcoming' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setFilter('upcoming')}
          >
            Предстоящие
          </button>
          <button
            className={`px-6 py-3 ${filter === 'past' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setFilter('past')}
          >
            Прошедшие
          </button>
        </div>
      </div>

      {/* Список вебинаров */}
      <div className="grid grid-cols-1 gap-8">
        {filteredWorkshops.map((workshop) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-lg shadow-lg border ${workshop.isPast ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-primary/30'}`}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${workshop.isPast ? 'bg-gray-700 text-gray-300' : 'bg-primary/20 text-primary-light'}`}>
                      {workshop.type}
                    </span>
                    {!workshop.isPast && (
                      <span className="ml-2 inline-block px-3 py-1 rounded-full bg-green-800/30 text-green-400 text-xs font-medium">
                        Регистрация открыта
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{workshop.title}</h3>
                <p className="text-gray-300 mb-4">{workshop.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-primary mr-2" />
                    <span>{formatDate(workshop.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-primary mr-2" />
                    <span>{workshop.time}, {workshop.duration} минут</span>
                  </div>
                  <div className="flex items-center">
                    <FaUserTie className="text-primary mr-2" />
                    <span className="text-sm">{workshop.speaker}</span>
                  </div>
                  {workshop.isPast && workshop.participants > 0 && (
                    <div className="flex items-center">
                      <FaUsers className="text-primary mr-2" />
                      <span>{workshop.participants} участников</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col justify-center items-center md:items-end gap-3 min-w-[180px]">
                {workshop.isPast && workshop.recordingUrl ? (
                  <button
                    onClick={() => setActiveVideoModal(workshop.id)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg transition duration-300"
                  >
                    <FaPlayCircle />
                    Смотреть запись
                  </button>
                ) : !workshop.isPast ? (
                  <a
                    href={workshop.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition duration-300"
                  >
                    <FaExternalLinkAlt />
                    Регистрация
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Запись недоступна</span>
                )}
                
                {!workshop.isPast && workshop.participants > 0 && (
                  <p className="text-sm text-center text-green-400">
                    Уже зарегистрировано: {workshop.participants}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Модальное окно с видео */}
      <AnimatePresence>
        {activeVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setActiveVideoModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl bg-gray-900 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={workshops.find(w => w.id === activeVideoModal)?.recordingUrl}
                  title="Workshop Recording"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <button
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition"
                onClick={() => setActiveVideoModal(null)}
              >
                <FaTimes size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Предложение поделиться отзывом */}
      <div className="mt-12 p-6 bg-gray-800 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-4">Были на наших мероприятиях?</h3>
        <p className="mb-6 text-gray-300">Поделитесь своим опытом и оставьте отзыв, чтобы помочь другим учителям!</p>
        <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition">
          Оставить отзыв
        </button>
      </div>
    </div>
  );
};

export default TeacherWorkshop; 