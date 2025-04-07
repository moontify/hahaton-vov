'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Quiz as QuizType } from '@/data/quizzes';
import { FaArrowLeft, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import QuizProgress from './QuizProgress';

interface QuizProps {
  quiz: QuizType;
  onClose: () => void;
}

export default function Quiz({ quiz, onClose }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
  };
  
  const handleConfirm = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };
  
  const calculatePercentage = () => {
    return Math.round((score / quiz.questions.length) * 100);
  };
  
  const getResultMessage = () => {
    const percentage = calculatePercentage();
    if (percentage >= 90) return 'Отлично! Вы отлично знаете историю Великой Отечественной войны!';
    if (percentage >= 70) return 'Хороший результат! Вы хорошо разбираетесь в истории войны.';
    if (percentage >= 50) return 'Неплохо, но есть над чем поработать.';
    return 'Стоит уделить больше внимания изучению истории Великой Отечественной войны.';
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setShowExplanation(false);
  };
  
  return (
    <motion.div 
      className="bg-card border border-border rounded-lg overflow-hidden shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onClose} 
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <FaArrowLeft className="mr-2" /> Назад к тестам
          </button>
          
          <div className="text-lg font-semibold text-foreground">
            {quiz.title}
          </div>
        </div>
        
        {!showResults && (
          <QuizProgress 
            currentQuestion={currentQuestionIndex + 1} 
            totalQuestions={quiz.questions.length} 
          />
        )}
        
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-6">{currentQuestion.question}</h3>
              
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedOption === index 
                        ? isAnswered 
                          ? index === currentQuestion.correctAnswer 
                            ? 'border-green-500 bg-green-500/10' 
                            : 'border-red-500 bg-red-500/10'
                          : 'border-primary bg-primary/10'
                        : isAnswered && index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isAnswered && index === currentQuestion.correctAnswer && (
                        <FaCheck className="text-green-500" />
                      )}
                      {isAnswered && selectedOption === index && index !== currentQuestion.correctAnswer && (
                        <FaTimes className="text-red-500" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center text-muted-foreground hover:text-foreground mb-2"
                  >
                    <FaInfoCircle className="mr-2" /> 
                    {showExplanation ? 'Скрыть объяснение' : 'Показать объяснение'}
                  </button>
                  
                  {showExplanation && (
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      {currentQuestion.explanation}
                    </div>
                  )}
                </motion.div>
              )}
              
              <div className="flex justify-between">
                {!isAnswered ? (
                  <button
                    onClick={handleConfirm}
                    disabled={selectedOption === null}
                    className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ответить
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-md"
                  >
                    {currentQuestionIndex < quiz.questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold mb-4">Результаты</h3>
              
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2 text-primary">{calculatePercentage()}%</div>
                <div className="text-muted-foreground">
                  Вы ответили правильно на {score} из {quiz.questions.length} вопросов
                </div>
              </div>
              
              <p className="mb-8">{getResultMessage()}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={restartQuiz}
                  className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-md"
                >
                  Пройти тест снова
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-secondary hover:bg-secondary/70 text-white rounded-md"
                >
                  Выбрать другой тест
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 