'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBookOpen, FaUniversity, FaFilePdf, FaChevronDown, FaChevronUp, FaDownload } from 'react-icons/fa';

// Данные о планах уроков
const lessonPlans = [
  {
    id: 1,
    title: 'Начало Великой Отечественной войны',
    gradeLevel: '9 класс',
    duration: '45 минут',
    topics: ['Вторжение Германии', 'Первые дни войны', 'Мобилизация'],
    objectives: ['Изучить причины начала войны', 'Проанализировать стратегию Германии', 'Оценить готовность СССР к войне'],
    materials: ['Карты военных действий', 'Архивные документы', 'Видеохроника 1941 года'],
    description: 'Урок знакомит учащихся с первыми днями Великой Отечественной войны, рассказывает о внезапном нападении Германии на СССР, героической обороне советских войск и мобилизации народа на отпор врагу.',
    downloadUrl: 'https://documents.infourok.ru/df257dcf-02b6-4444-b0c4-74e6f4af8180/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D1%83%D1%80%D0%BE%D0%BA%D0%B0%20%D0%BD%D0%B0%20%D1%82%D0%B5%D0%BC%D1%83%20%22%D0%9D%D0%B0%D1%87%D0%B0%D0%BB%D0%BE%20%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%B9%20%D0%9E%D1%82%D0%B5%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9%20%D0%B2%D0%BE%D0%B9%D0%BD%D1%8B%22%20%289%20%D0%BA%D0%BB%D0%B0%D1%81%D1%81%29..pdf',
  },
  {
    id: 2,
    title: 'Блокада Ленинграда',
    gradeLevel: '8-9 класс',
    duration: '90 минут',
    topics: ['Окружение города', 'Дорога жизни', 'Жизнь в блокадном городе'],
    objectives: ['Сформировать представление о тяготах блокады', 'Рассказать о героизме жителей', 'Проанализировать значение обороны города'],
    materials: ['Дневник Тани Савичевой', 'Фотоматериалы', 'Карта блокадного Ленинграда'],
    description: 'Двухчасовой урок, посвященный одной из самых трагических страниц войны - блокаде Ленинграда. Ученики узнают о тяжелых условиях жизни в осажденном городе, героизме его защитников и жителей.',
    downloadUrl: 'https://documents.infourok.ru/724ef864-ea45-447f-b7c1-673a71198af4/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D0%BB%D0%B8%D1%81%D1%82%20%22%D0%91%D0%BB%D0%BE%D0%BA%D0%B0%D0%B4%D0%B0%20%D0%9B%D0%B5%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%D0%B0%22.docx',
  },
  {
    id: 3,
    title: 'Курская битва - коренной перелом в войне',
    gradeLevel: '10-11 класс',
    duration: '45 минут',
    topics: ['Планы сторон', 'Прохоровское сражение', 'Итоги и значение'],
    objectives: ['Изучить план операции "Цитадель"', 'Проанализировать ход сражения', 'Оценить значение победы'],
    materials: ['Схемы танковых сражений', 'Воспоминания участников', 'Статистика потерь'],
    description: 'Урок посвящен крупнейшему танковому сражению Второй мировой войны и его значению для дальнейшего хода боевых действий. Рассматривается стратегия советского командования.',
    downloadUrl: 'https://documents.infourok.ru/ec99213a-d0a8-41d2-a1cc-a6278c859d6a/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D1%83%D1%80%D0%BE%D0%BA%D0%B0%20%22%D0%9A%D1%83%D1%80%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B1%D0%B8%D1%82%D0%B2%D0%B0%22.doc',
  },
  {
    id: 4,
    title: 'Партизанское движение в годы ВОВ',
    gradeLevel: '7-8 класс',
    duration: '45 минут',
    topics: ['Организация партизанских отрядов', 'Герои-партизаны', 'Значение партизанского движения'],
    objectives: ['Рассказать о формировании партизанского движения', 'Познакомить с героями-партизанами', 'Показать вклад партизан в победу'],
    materials: ['Карта партизанских зон', 'Биографии героев', 'Документальные материалы'],
    description: 'Урок знакомит учащихся с развитием партизанского движения на оккупированных территориях СССР, рассказывает о подвигах народных мстителей и их вкладе в общую победу.',
    downloadUrl: 'https://nsportal.ru/sites/default/files/2020/02/07/partizanskoe_dvizhenie_v_gody_v.o.v.zip',
  },
  {
    id: 5,
    title: 'Освобождение Европы от фашизма',
    gradeLevel: '10-11 класс',
    duration: '45 минут',
    topics: ['Изгнание врага с территории СССР', 'Освободительная миссия Красной Армии', 'Берлинская операция'],
    objectives: ['Изучить основные операции 1944-1945 гг.', 'Оценить роль СССР в освобождении Европы', 'Проанализировать итоги войны'],
    materials: ['Карты заключительных операций', 'Документы о капитуляции Германии', 'Хроника встречи на Эльбе'],
    description: 'Урок посвящен заключительному этапу Великой Отечественной войны - изгнанию врага с территории СССР и освобождению стран Европы от нацизма. Рассматривается значение Победы.',
    downloadUrl: 'https://militera.org/books/pdf/research/sb_osvodozhdenie-evropy-ot-nazisma.pdf',
  },
];

export default function LessonPlans() {
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  
  const toggleExpand = (id: number) => {
    setExpandedLesson(expandedLesson === id ? null : id);
  };
  
  return (
    <div className="space-y-6">
      {lessonPlans.map((lesson, index) => (
        <motion.div 
          key={lesson.id}
          className="bg-card border border-gray-700 rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div 
            className="p-6 cursor-pointer hover:bg-gray-800/30 transition-colors"
            onClick={() => toggleExpand(lesson.id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{lesson.title}</h3>
              <button 
                className="bg-primary/20 hover:bg-primary/30 text-primary-light p-2 rounded-full transition-colors"
                aria-label={expandedLesson === lesson.id ? "Свернуть" : "Развернуть"}
              >
                {expandedLesson === lesson.id ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
              <div className="flex items-center">
                <FaUniversity className="mr-2 text-primary-light" /> {lesson.gradeLevel}
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2 text-primary-light" /> {lesson.duration}
              </div>
              <div className="flex items-center">
                <FaBookOpen className="mr-2 text-primary-light" /> {lesson.topics.length} темы
              </div>
            </div>
            
            <p className="mt-4 text-gray-300">{lesson.description}</p>
          </div>
          
          <AnimatePresence>
            {expandedLesson === lesson.id && (
              <motion.div 
                className="px-6 pb-6 border-t border-gray-700 pt-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-primary-light">Цели урока</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      {lesson.objectives.map((objective, i) => (
                        <li key={i}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-amber-400">Основные темы</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      {lesson.topics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-bold mb-2 text-blue-400">Материалы для урока</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {lesson.materials.map((material, i) => (
                      <li key={i}>{material}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <a
                    href={lesson.downloadUrl}
                    className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <FaFilePdf /> Скачать план урока
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
} 