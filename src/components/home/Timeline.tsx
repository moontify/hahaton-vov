'use client';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Image from 'next/image';

const timelineEvents = [
  {
    id: 1,
    title: 'Начало войны',
    date: '22 июня 1941',
    description: 'Германия без объявления войны напала на СССР. Началась Великая Отечественная война, продлившаяся 1418 дней и ставшая самым кровопролитным конфликтом в истории нашей страны.',
    image: 'https://media.kpfu.ru/sites/default/files/2025-06/E352FE9C-2BAB-445A-8B5A-313EAE277BDA.jpeg'
  },
  {
    id: 2,
    title: 'Битва за Москву',
    date: '30 сентября 1941 - 20 апреля 1942',
    description: 'Первое крупное поражение немецких войск во Второй мировой войне. Советские войска остановили наступление вермахта и развеяли миф о непобедимости нацистской Германии.',
    image: 'https://rmbs-ufa.ru/images/novosti/09/6rtnGmh7Des.jpg'
  },
  {
    id: 3,
    title: 'Блокада Ленинграда',
    date: '8 сентября 1941 - 27 января 1944',
    description: '872 дня в окружении. Героическая оборона Ленинграда стала символом мужества и стойкости советских людей, выдержавших голод, холод и постоянные бомбардировки.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/RIAN_archive_2153_After_bombing.jpg/300px-RIAN_archive_2153_After_bombing.jpg'
  },
  {
    id: 4,
    title: 'Сталинградская битва',
    date: '17 июля 1942 - 2 февраля 1943',
    description: 'Коренной перелом в ходе войны. В результате ожесточенных боев советские войска окружили и разгромили 6-ю армию вермахта. Стратегическая инициатива перешла к Красной Армии.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/%D0%A4%D0%BE%D0%BD%D1%82%D0%B0%D0%BD_%C2%AB%D0%94%D0%B5%D1%82%D1%81%D0%BA%D0%B8%D0%B9_%D1%85%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%C2%BB.jpg'
  },
  {
    id: 5,
    title: 'Курская битва',
    date: '5 июля 1943 - 23 августа 1943',
    description: 'Завершение коренного перелома в ходе войны. В ходе этой битвы произошло крупнейшее танковое сражение в истории под Прохоровкой, где столкнулись сотни бронемашин.',
    image: 'https://interaffairs.ru/i/2021/08/739882debe4927ef6c9ee0d30339081d.jpg'
  },
  {
    id: 6,
    title: 'Операция "Багратион"',
    date: '23 июня 1944 - 29 августа 1944',
    description: 'Одна из крупнейших военных операций за всю историю. В результате стремительного наступления советских войск была освобождена Белоруссия и началось освобождение Польши.',
    image: 'https://mcdn2.tvzvezda.ru/storage/default/2019/04/30/d9f8a4223f2c438b8ac115b741c87c94.jpg'
  },
  {
    id: 7,
    title: 'Берлинская операция',
    date: '16 апреля 1945 - 8 мая 1945',
    description: 'Завершающая стратегическая операция Красной армии, в ходе которой был взят Берлин. Советские войска в тяжелых уличных боях овладели столицей Германии.',
    image: 'https://s1.stc.all.kpcdn.net/putevoditel/projectid_379258/images/tild3962-3164-4965-b361-346636373464__19450401_gaf_u39_002.jpg'
  },
  {
    id: 8,
    title: 'День Победы',
    date: '9 мая 1945',
    description: 'Капитуляция Германии. Победа СССР в Великой Отечественной войне. В ночь с 8 на 9 мая был подписан акт о безоговорочной капитуляции Германии.',
    image: 'https://arsenal.army/images/editor/9maya2018_1.jpg'
  },
];

export default function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef, { once: true, amount: 0.2 });
  const nextSlide = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === timelineEvents.length - 1 ? 0 : prevIndex + 1
    );
  };
  const prevSlide = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? timelineEvents.length - 1 : prevIndex - 1
    );
  };
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={timelineRef}>
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ключевые события</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-amber-500 mx-auto rounded-full"></div>
      </div>
      <div className="relative mb-20 py-6">
        <div className="absolute left-0 right-0 h-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-full"></div>
        <div className="relative flex justify-between">
          {timelineEvents.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div 
                className={`w-5 h-5 rounded-full border-2 cursor-pointer z-10 transition-all duration-300 
                  ${index === activeIndex 
                    ? 'bg-red-600 border-red-400 scale-150 shadow-lg shadow-red-500/30' 
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'}`}
                onClick={() => setActiveIndex(index)}
              ></div>
              <motion.div 
                className={`absolute top-8 -translate-x-1/2 whitespace-nowrap font-medium transition-colors duration-300
                  ${index === activeIndex ? 'text-white' : 'text-gray-500'}`}
                style={{ left: '50%' }}
                animate={index === activeIndex ? { scale: 1.1 } : { scale: 1 }}
              >
                {event.date.split(' ')[2] || event.date.split(' ')[0]}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-xl backdrop-blur-sm overflow-hidden border border-gray-700/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full filter blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full filter blur-3xl translate-x-1/4 translate-y-1/4"></div>
        <div className="relative z-10">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row gap-10"
          >
            <div className="md:w-1/2 flex flex-col">
              <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold px-4 py-1.5 rounded-full inline-block mb-4 text-sm w-fit">
                {timelineEvents[activeIndex].date}
              </div>
              <h3 className="text-3xl font-bold mb-6 text-white">{timelineEvents[activeIndex].title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">{timelineEvents[activeIndex].description}</p>
            </div>
            <div className="md:w-1/2 relative rounded-xl overflow-hidden bg-gray-800 aspect-video shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 opacity-40"></div>
              <Image 
                src={timelineEvents[activeIndex].image || '/images/events/default.jpg'}
                alt={timelineEvents[activeIndex].title}
                width={400}
                height={300}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </motion.div>
        </div>
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
          <button
            className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-colors shadow-lg"
            onClick={prevSlide}
            aria-label="Предыдущее событие"
          >
            <FaAngleLeft className="text-xl" />
          </button>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
          <button
            className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-colors shadow-lg"
            onClick={nextSlide}
            aria-label="Следующее событие"
          >
            <FaAngleRight className="text-xl" />
          </button>
        </div>
      </div>
      <div className="mt-8 flex justify-center gap-2 md:hidden">
        {timelineEvents.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? 'bg-red-600 w-6' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Перейти к событию ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 