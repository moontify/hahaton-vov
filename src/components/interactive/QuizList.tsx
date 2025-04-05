'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';

const quizzes = [
  {
    id: 1,
    title: 'Важные даты Великой Отечественной войны',
    description: 'Проверьте свои знания основных дат и событий Великой Отечественной войны',
    difficulty: 'Средний',
    questionsCount: 10,
    image: '/images/quizzes/dates.jpg'
  },
  {
    id: 2,
    title: 'Герои войны',
    description: 'Тест на знание героев Великой Отечественной войны и их подвигов',
    difficulty: 'Сложный',
    questionsCount: 15,
    image: '/images/quizzes/heroes.jpg'
  },
  {
    id: 3,
    title: 'Основные сражения',
    description: 'Вопросы о ключевых сражениях, изменивших ход Великой Отечественной войны',
    difficulty: 'Средний',
    questionsCount: 12,
    image: '/images/quizzes/battles.jpg'
  },
  {
    id: 4,
    title: 'Оружие и техника',
    description: 'Тест на знание вооружения и военной техники периода 1941-1945 годов',
    difficulty: 'Сложный',
    questionsCount: 10,
    image: '/images/quizzes/weapons.jpg'
  }
];

export default function QuizList() {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  
  return (
    <div className="space-y-6">
      <motion.h2 
        className="text-2xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Интерактивные викторины
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            className={`bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all ${selectedQuiz === quiz.id ? 'border-primary' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedQuiz(quiz.id)}
          >
            <div className="h-40 bg-gray-800 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="px-2 py-1 bg-primary text-xs rounded-full">{quiz.difficulty}</span>
                <span className="ml-2 text-xs">{quiz.questionsCount} вопросов</span>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2">{quiz.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{quiz.description}</p>
              
              <button 
                className="w-full py-2 bg-primary hover:bg-primary/80 text-white rounded-md flex items-center justify-center transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Запуск викторины ${quiz.id}`);
                }}
              >
                <FaPlay className="mr-2" /> Начать викторину
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        className="text-center mt-8 text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Скоро здесь появятся новые интерактивные материалы!
      </motion.div>
    </div>
  );
} 