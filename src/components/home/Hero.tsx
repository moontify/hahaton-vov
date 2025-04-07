'use client';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
export default function Hero() {
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const yScroll = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.8, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth - e.pageX * 2) / 100;
      const y = (window.innerHeight - e.pageY * 2) / 100;
      setParallaxOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative h-screen overflow-hidden">
      <motion.div 
        className="absolute inset-0 w-full h-full bg-black"
        style={{ 
          y: yScroll,
          scale,
          backgroundImage: `url('https://images.unsplash.com/photo-1615893240437-a395867adbe1?q=80&w=1740&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: `${50 + parallaxOffset.x}% ${50 + parallaxOffset.y}%`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-red-900/30 mix-blend-multiply"></div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 z-10"></div>
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-red-700/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ opacity }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-6 relative inline-block">
              <h1 className="relative text-4xl md:text-6xl lg:text-7xl font-bold text-white text-shadow-lg">
                <span className="text-white">Память</span> о подвиге народа
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-200 mb-10">
              Великая Отечественная война 1941-1945 годов — 
              трагедия и торжество человеческого духа,
              которые нельзя забыть
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10">
              <Link 
                href="/heroes" 
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-white font-semibold transition-all hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5"
              >
                База данных героев
              </Link>
              <Link 
                href="/history" 
                className="px-8 py-4 bg-gradient-to-r from-gray-800/90 to-gray-700/90 hover:from-gray-700/90 hover:to-gray-600/90 backdrop-blur rounded-lg text-white font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 border border-gray-700"
              >
                Изучить историю
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ 
          y: [0, 12, 0], 
          opacity: [0.6, 1, 0.6] 
        }}
        transition={{ 
          repeat: Infinity,
          duration: 2
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">Листайте вниз</span>
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
} 