'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaPlay, FaPuzzlePiece, FaListAlt, FaFilter, FaTimes } from 'react-icons/fa';

interface Assignment {
  id: number;
  title: string;
  type: string;
  format: string;
  gradeLevel: string;
  subject: string;
  description: string;
  previewUrl: string;
  downloadUrl: string;
}

export default function InteractiveAssignments() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const assignments: Assignment[] = [
    {
      id: 1,
      title: 'Хронология основных событий ВОВ',
      type: 'Интерактивная временная линия',
      format: 'HTML5',
      gradeLevel: '5-7 класс',
      subject: 'История',
      description: 'Интерактивное задание, позволяющее ученикам расположить ключевые события войны в хронологическом порядке с описанием каждого события.',
      previewUrl: '/timeline-preview.jpg',
      downloadUrl: '/assignments/vov-timeline.zip'
    },
    {
      id: 2,
      title: 'Полководцы Великой Отечественной',
      type: 'Интерактивная карточная игра',
      format: 'HTML5',
      gradeLevel: '8-9 класс',
      subject: 'История',
      description: 'Игра на сопоставление фотографий полководцев с их биографиями и основными достижениями.',
      previewUrl: '/commanders-cards-preview.jpg',
      downloadUrl: '/assignments/commanders-cards.zip'
    },
    {
      id: 3,
      title: 'Карта сражений: интерактивный квест',
      type: 'Интерактивная карта',
      format: 'HTML5/JS',
      gradeLevel: '10-11 класс',
      subject: 'История',
      description: 'Интерактивная карта сражений ВОВ с возможностью прохождения квеста по ключевым битвам и их значению.',
      previewUrl: '/battles-map-preview.jpg',
      downloadUrl: '/assignments/battles-map-quest.zip'
    },
    {
      id: 4,
      title: 'Литература военных лет',
      type: 'Интерактивный тест',
      format: 'SCORM',
      gradeLevel: '9-11 класс',
      subject: 'Литература',
      description: 'Тест на знание произведений, написанных в годы Великой Отечественной войны, с интерактивными вопросами разных типов.',
      previewUrl: '/war-literature-preview.jpg',
      downloadUrl: '/assignments/war-literature-test.zip'
    },
    {
      id: 5,
      title: 'Герои войны в задачах по математике',
      type: 'Интерактивные задачи',
      format: 'HTML5',
      gradeLevel: '5-7 класс',
      subject: 'Математика',
      description: 'Математические задачи с использованием исторических данных о подвигах героев Великой Отечественной войны.',
      previewUrl: '/math-heroes-preview.jpg',
      downloadUrl: '/assignments/heroes-math-problems.zip'
    },
    {
      id: 6,
      title: 'Конструктор исторических карт',
      type: 'Интерактивный конструктор',
      format: 'HTML5/JS',
      gradeLevel: '8-11 класс',
      subject: 'История',
      description: 'Инструмент для создания собственных исторических карт и схем сражений с возможностью сохранения и демонстрации.',
      previewUrl: '/map-constructor-preview.jpg',
      downloadUrl: '/assignments/map-constructor.zip'
    },
    {
      id: 7,
      title: 'Экономика и промышленность в годы войны',
      type: 'Интерактивная инфографика',
      format: 'SCORM',
      gradeLevel: '10-11 класс',
      subject: 'История/Экономика',
      description: 'Интерактивная инфографика, демонстрирующая изменения в экономике и промышленности СССР в военное время.',
      previewUrl: '/war-economy-preview.jpg',
      downloadUrl: '/assignments/war-economy-infographic.zip'
    },
    {
      id: 8,
      title: 'Великая Отечественная война в искусстве',
      type: 'Интерактивная галерея',
      format: 'HTML5',
      gradeLevel: '7-11 класс',
      subject: 'МХК/Искусство',
      description: 'Галерея произведений искусства (живопись, скульптура, плакаты) военного времени с интерактивными заданиями по анализу.',
      previewUrl: '/war-art-preview.jpg',
      downloadUrl: '/assignments/war-in-art-gallery.zip'
    }
  ];

  const grades = ['5-7 класс', '8-9 класс', '9-11 класс', '10-11 класс', '7-11 класс'];
  const types = ['Интерактивная временная линия', 'Интерактивная карточная игра', 'Интерактивная карта', 'Интерактивный тест', 'Интерактивные задачи', 'Интерактивный конструктор', 'Интерактивная инфографика', 'Интерактивная галерея'];
  const subjects = ['История', 'Литература', 'Математика', 'История/Экономика', 'МХК/Искусство'];

  const filteredAssignments = assignments.filter(assignment => {
    if (selectedType && assignment.type !== selectedType) return false;
    if (selectedGrade && assignment.gradeLevel !== selectedGrade) return false;
    if (selectedSubject && !assignment.subject.includes(selectedSubject)) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedGrade(null);
    setSelectedSubject(null);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-2xl font-bold">Интерактивные задания для уроков</h2>
          <p className="text-muted-foreground mt-1">
            Готовые интерактивные материалы для использования на уроках
          </p>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary"
        >
          <FaFilter className="mr-2" /> 
          {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </button>
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-lg p-4 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Тип задания</label>
                <select 
                  value={selectedType || ''}
                  onChange={(e) => setSelectedType(e.target.value || null)}
                  className="w-full p-2 border border-border rounded-md bg-card"
                >
                  <option value="">Все типы</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Класс</label>
                <select 
                  value={selectedGrade || ''}
                  onChange={(e) => setSelectedGrade(e.target.value || null)}
                  className="w-full p-2 border border-border rounded-md bg-card"
                >
                  <option value="">Все классы</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Предмет</label>
                <select 
                  value={selectedSubject || ''}
                  onChange={(e) => setSelectedSubject(e.target.value || null)}
                  className="w-full p-2 border border-border rounded-md bg-card"
                >
                  <option value="">Все предметы</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
            {(selectedType || selectedGrade || selectedSubject) && (
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={clearFilters}
                  className="flex items-center px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <FaTimes className="mr-1" /> Сбросить фильтры
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {filteredAssignments.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredAssignments.map((assignment, index) => (
            <motion.div 
              key={assignment.id}
              className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <div className="h-48 bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                  <div className="text-center p-4">
                    <FaPuzzlePiece className="text-4xl mx-auto mb-2" />
                    <div className="text-sm font-medium">Предпросмотр интерактивного задания</div>
                    <button className="mt-3 px-4 py-1 bg-primary text-white rounded-md text-sm flex items-center mx-auto">
                      <FaPlay className="mr-2" /> Просмотр
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg leading-tight">{assignment.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{assignment.type}</span>
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">{assignment.gradeLevel}</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">{assignment.format}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {assignment.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{assignment.subject}</span>
                  <a 
                    href={assignment.downloadUrl}
                    className="flex items-center text-sm bg-primary hover:bg-primary/80 text-white px-3 py-1.5 rounded-md"
                  >
                    <FaDownload className="mr-2" /> Скачать
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaListAlt className="text-4xl mx-auto mb-4 text-muted" />
          <h3 className="text-xl font-bold mb-2">Нет подходящих заданий</h3>
          <p className="text-muted-foreground mb-4">
            По выбранным фильтрам не найдено никаких заданий. Попробуйте изменить критерии поиска.
          </p>
          <button 
            onClick={clearFilters}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Сбросить фильтры
          </button>
        </motion.div>
      )}

      <motion.div 
        className="mt-10 p-6 bg-secondary/10 rounded-lg border border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Создайте свое интерактивное задание</h3>
            <p className="text-muted-foreground">
              Используйте наш конструктор для создания собственных интерактивных заданий на тему Великой Отечественной войны
            </p>
          </div>
          <button className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-md whitespace-nowrap">
            Открыть конструктор
          </button>
        </div>
      </motion.div>
    </div>
  );
} 