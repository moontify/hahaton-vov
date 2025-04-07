'use client';
import { motion } from 'framer-motion';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export default function QuizProgress({ currentQuestion, totalQuestions }: QuizProgressProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-muted-foreground">
          Вопрос {currentQuestion} из {totalQuestions}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      <div className="w-full bg-secondary/30 rounded-full h-2.5 overflow-hidden">
        <motion.div 
          className="bg-gradient-to-r from-primary to-primary-light h-2.5 rounded-full"
          initial={{ width: `${(currentQuestion - 1) / totalQuestions * 100}%` }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
} 