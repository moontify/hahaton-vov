'use client';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import { Quiz } from '@/data/quizzes';

const quizImages = {
  1: 'https://rvio.histrf.ru/uploads/media/default/0001/11/ca131f6c1bcf5c65ef4a01785623927683b16a66.png', // Даты ВОВ
  2: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5_5b2D19Vig8kSgYYnzvF8T91xhp9bt5m-g&s', // Герои войны
  3: 'https://rgdb.ru/images/News_main/2023/02/02/04/dmitrij-mahashvili-stalingradskaya-bitva.jpg', // Основные сражения
  4: 'https://filinfo.ru/images/photo/9773_1437745640_0_p.jpg', // Оружие и техника
};

interface QuizCardProps {
  quiz: Quiz;
  index: number;
  onSelect: (quizId: number) => void;
}

export default function QuizCard({ quiz, index, onSelect }: QuizCardProps) {
  return (
    <motion.div
      className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
      whileHover={{ scale: 1.02 }}
    >
      <div 
        className="h-40 bg-gray-800 relative bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${quizImages[quiz.id as keyof typeof quizImages] || '/images/quizzes/default.jpg'})` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <span className="px-2 py-1 bg-primary text-xs rounded-full">{quiz.difficulty}</span>
          <span className="ml-2 text-xs">{quiz.questions.length} вопросов</span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-foreground">{quiz.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>
        
        <button 
          className="w-full py-2 bg-primary hover:bg-primary/80 text-white rounded-md flex items-center justify-center transition-colors"
          onClick={() => onSelect(quiz.id)}
        >
          <FaPlay className="mr-2" /> Начать викторину
        </button>
      </div>
    </motion.div>
  );
} 