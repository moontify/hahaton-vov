'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { quizzes } from '@/data/quizzes';
import Quiz from './Quiz';
import QuizCard from './QuizCard';

export default function QuizList() {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  
  const handleQuizSelect = (quizId: number) => {
    setSelectedQuiz(quizId);
  };
  
  const handleCloseQuiz = () => {
    setSelectedQuiz(null);
  };

  const selectedQuizData = selectedQuiz !== null 
    ? quizzes.find(quiz => quiz.id === selectedQuiz) 
    : null;
  
  if (selectedQuizData) {
    return <Quiz quiz={selectedQuizData} onClose={handleCloseQuiz} />;
  }
  
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
          <QuizCard 
            key={quiz.id}
            quiz={quiz}
            index={index}
            onSelect={handleQuizSelect}
          />
        ))}
      </motion.div>
      
      <motion.div 
        className="text-center mt-8 text-muted-foreground text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
      </motion.div>
    </div>
  );
} 