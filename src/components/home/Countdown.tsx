'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
type CountdownProps = {
  targetDate: string;
};
type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  const SingleDigit = ({ digit }: { digit: string }) => {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={digit}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="w-full h-full flex items-center justify-center"
        >
          <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{digit}</span>
        </motion.div>
      </AnimatePresence>
    );
  };
  const CountdownItem = ({ value, label }: { value: number, label: string }) => {
    const valueStr = value.toString().padStart(2, '0');
    const digit1 = valueStr[0];
    const digit2 = valueStr[1];
    return (
      <div className="flex flex-col items-center mx-4">
        <div className="flex">
          <div className="w-14 md:w-16 h-20 md:h-24 mb-3 bg-gray-800 rounded-lg overflow-hidden shadow-lg flex items-center justify-center border border-gray-700/50 mr-1">
            <SingleDigit digit={digit1} />
          </div>
          <div className="w-14 md:w-16 h-20 md:h-24 mb-3 bg-gray-800 rounded-lg overflow-hidden shadow-lg flex items-center justify-center border border-gray-700/50 ml-1">
            <SingleDigit digit={digit2} />
          </div>
        </div>
        <span className="text-sm text-gray-400 uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
    );
  };
  const Separator = () => (
    <div className="text-gray-500 self-center text-3xl font-bold pb-4 mx-1">
      :
    </div>
  );
  if (!isClient) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-6xl mb-12 bg-black/20 backdrop-blur-sm py-8 px-4 rounded-xl border border-gray-800/50">
      <div className="flex justify-center items-center flex-wrap">
        <CountdownItem value={timeLeft.days} label="дней" />
        <Separator />
        <CountdownItem value={timeLeft.hours} label="часов" />
        <Separator />
        <CountdownItem value={timeLeft.minutes} label="минут" />
        <Separator />
        <CountdownItem value={timeLeft.seconds} label="секунд" />
      </div>
      <div className="w-48 h-1 bg-gradient-to-r from-red-600 to-amber-500 mx-auto mt-6 rounded-full" />
    </div>
  );
} 