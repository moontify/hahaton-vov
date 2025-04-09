'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileAlt, FaDownload, FaChalkboardTeacher, FaFilter, FaTimes } from 'react-icons/fa';

// Данные о методических разработках
const resources = [
  {
    id: 1,
    title: 'Методическая разработка урока "Начало Великой Отечественной войны"',
    type: 'План урока',
    subject: 'История',
    grade: '9-11 класс',
    description: 'Подробный план урока с презентацией, раздаточными материалами и интерактивными заданиями.',
    fileUrl: 'https://documents.infourok.ru/878dc3f7-a1bc-4041-8080-3febe99b583f/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%BE%D0%B3%D0%BE%20%D1%83%D1%80%D0%BE%D0%BA%D0%B0%20%D0%BF%D0%BE%20%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8%20%D0%BD%D0%B0%20%D1%82%D0%B5%D0%BC%D1%83%20%22%D0%9E%D1%82%D0%B5%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F%20%D0%B2%D0%BE%D0%B9%D0%BD%D0%B0%201941-1945%D0%B3%D0%B3.%20%D0%9C%D1%8B-%20%D0%BF%D0%BE%D0%BC%D0%BD%D0%B8%D0%BC%21%22.docx',
    pageCount: 17,
    downloadFormat: 'DOCX',
  },
  {
    id: 2,
    title: 'Классный час "Герои Великой Отечественной войны"',
    type: 'Внеклассное мероприятие',
    subject: 'Воспитательная работа',
    grade: '5-8 класс',
    description: 'Сценарий классного часа для среднего звена с игровыми элементами и мультимедийными материалами.',
    fileUrl: 'https://documents.infourok.ru/b791d53a-d6da-4f39-9851-5bce085bbfcc/%D0%9A%D0%BB%D0%B0%D1%81%D1%81%D0%BD%D1%8B%D0%B9%20%D1%87%D0%B0%D1%81%20%22%20%D0%93%D0%B5%D1%80%D0%BE%D0%B8%20%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%B9%20%D0%9E%D1%82%D0%B5%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9%20%D0%B2%D0%BE%D0%B9%D0%BD%D1%8B%22.docx',
    pageCount: 8,
    downloadFormat: 'PDF, DOCX',
  },
  {
    id: 3,
    title: 'Методическая разработка "Курская битва - коренной перелом"',
    type: 'План урока',
    subject: 'История',
    grade: '9-11 класс',
    description: 'Разработка урока с использованием технологии проблемного обучения и работы с историческими документами.',
    fileUrl: 'https://documents.infourok.ru/ec99213a-d0a8-41d2-a1cc-a6278c859d6a/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D1%83%D1%80%D0%BE%D0%BA%D0%B0%20%22%D0%9A%D1%83%D1%80%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B1%D0%B8%D1%82%D0%B2%D0%B0%22.doc',
    pageCount: 12,
    downloadFormat: 'PDF',
  },
  {
    id: 4,
    title: 'Рабочие листы по теме "Блокада Ленинграда"',
    type: 'Раздаточный материал',
    subject: 'История',
    grade: '7-9 класс',
    description: 'Набор рабочих листов для самостоятельной и групповой работы обучающихся по теме "Блокада Ленинграда".',
    fileUrl: 'https://documents.infourok.ru/724ef864-ea45-447f-b7c1-673a71198af4/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D0%BB%D0%B8%D1%81%D1%82%20%22%D0%91%D0%BB%D0%BE%D0%BA%D0%B0%D0%B4%D0%B0%20%D0%9B%D0%B5%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%D0%B0%22.docx',
    pageCount: 6,
    downloadFormat: 'DOCX',
  },
  {
    id: 5,
    title: 'Методическая разработка проектной деятельности "Моя семья в годы войны"',
    type: 'Проектная деятельность',
    subject: 'История, Краеведение',
    grade: '5-11 класс',
    description: 'Подробное описание организации проектной деятельности по сбору и систематизации материалов об участии родственников в ВОВ.',
    fileUrl: 'https://documents.infourok.ru/f3add38e-8eba-41e6-85a0-34cd8616b78f/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%20%22%D0%9C%D0%BE%D1%8F%20%D1%81%D0%B5%D0%BC%D1%8C%D1%8F%20%D0%B2%20%D0%B3%D0%BE%D0%B4%D1%8B%20%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%B9%20%D0%BE%D1%82%D0%B5%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9%20%D0%B2%D0%BE%D0%B9%D0%BD%D1%8B%22.doc',
    pageCount: 18,
    downloadFormat: 'DOC',
  },
];

// Варианты для фильтрации
const grades = ['Все классы', '5-8 класс', '9-11 класс', '7-9 класс', '5-11 класс'];
const types = ['Все типы', 'План урока', 'Внеклассное мероприятие', 'Наглядное пособие', 'Раздаточный материал', 'Проектная деятельность'];
const subjects = ['Все предметы', 'История', 'Воспитательная работа', 'Краеведение', 'История, Краеведение'];

export default function TeacherResources() {
  const [selectedGrade, setSelectedGrade] = useState('Все классы');
  const [selectedType, setSelectedType] = useState('Все типы');
  const [selectedSubject, setSelectedSubject] = useState('Все предметы');
  const [showFilters, setShowFilters] = useState(false);
  
  // Фильтрация ресурсов
  const filteredResources = resources.filter(resource => {
    const matchesGrade = selectedGrade === 'Все классы' || resource.grade === selectedGrade;
    const matchesType = selectedType === 'Все типы' || resource.type === selectedType;
    const matchesSubject = selectedSubject === 'Все предметы' || resource.subject.includes(selectedSubject.replace('Все предметы', ''));
    
    return matchesGrade && matchesType && matchesSubject;
  });
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="bg-primary/20 hover:bg-primary/30 text-primary-light px-4 py-2 rounded-lg flex items-center gap-2 transition-colors self-start"
        >
          <FaFilter /> {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </button>
        
        <div className="text-gray-400 text-sm">
          Найдено материалов: {filteredResources.length}
        </div>
      </div>
      
      {showFilters && (
        <motion.div 
          className="bg-gray-800 p-4 rounded-lg border border-gray-700"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Класс</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Тип материала</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Предмет</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSelectedGrade('Все классы');
                setSelectedType('Все типы');
                setSelectedSubject('Все предметы');
              }}
              className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
            >
              <FaTimes size={12} /> Сбросить фильтры
            </button>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            className="bg-card border border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-primary/20 text-primary-light text-xs rounded-full">
                  {resource.type}
                </span>
                <span className="text-gray-400 text-sm">{resource.grade}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FaChalkboardTeacher className="mr-2" /> {resource.subject}
                {resource.pageCount && (
                  <span className="ml-4">
                    <FaFileAlt className="mr-2 inline" /> {resource.pageCount} стр.
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Формат: {resource.downloadFormat}</span>
                <a
                  href={resource.fileUrl}
                  className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                >
                  <FaDownload size={14} /> Скачать
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">По выбранным фильтрам ничего не найдено</p>
          <button
            onClick={() => {
              setSelectedGrade('Все классы');
              setSelectedType('Все типы');
              setSelectedSubject('Все предметы');
            }}
            className="bg-primary/20 hover:bg-primary/30 text-primary-light px-4 py-2 rounded-lg transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
} 