import Hero from '@/components/home/Hero';
import Timeline from '@/components/home/Timeline';
import News from '@/components/home/News';
import Countdown from '@/components/home/Countdown';
import AnimatedGallery from '@/components/home/AnimatedGallery';
import StatsBanner from '@/components/home/StatsBanner';
import QuoteBlock from '@/components/home/QuoteBlock';
import { FaRegCalendarAlt, FaUsers, FaRegNewspaper, FaRegClock } from 'react-icons/fa';
export default function Home() {
  return (
    <div className="min-h-screen">
            <Hero />
            
            <section className="py-16 bg-gradient-to-tr from-card/70 to-black/30">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              <span className="text-gradient">Наша миссия</span>
            </h2>
            <div className="bg-card/70 border border-primary/20 rounded-xl p-6 md:p-8 shadow-xl">
              <p className="text-lg text-gray-300 mb-4">
                <strong className="text-primary-light">Интерактивный портал истории ВОВ</strong> создан для сохранения и передачи исторической памяти о подвиге нашего народа во время Великой Отечественной войны.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/20 p-3 text-primary flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Образовательная цель</h3>
                    <p className="text-gray-300">Предоставить современные интерактивные инструменты для изучения истории ВОВ в школах и вузах.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-accent/20 p-3 text-accent flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Социальная функция</h3>
                    <p className="text-gray-300">Создать площадку для сохранения семейных историй и формирования единого архива памяти.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-500/20 p-3 text-amber-500 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Просветительская миссия</h3>
                    <p className="text-gray-300">Противодействовать искажению исторических фактов и сохранять достоверную информацию о войне.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-500/20 p-3 text-blue-500 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Целевая аудитория</h3>
                    <p className="text-gray-300">Школьники, студенты, учителя истории, исследователи и все интересующиеся историей Отечества.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
            
            <StatsBanner />
            <section className="py-20 bg-card relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10"></div>
        <div className="container-custom relative z-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-shadow">
            <span className="text-gradient">Хроники войны в фотографиях</span>
          </h2>
          <AnimatedGallery />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
      </section>
            <QuoteBlock 
        quote="Тот, кто не помнит своего прошлого, осуждён на то, чтобы пережить его вновь."
        author="Джордж Сантаяна"
      />
            <section className="py-20 bg-gradient-to-br from-card to-secondary/30 relative overflow-hidden">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-12 justify-center">
            <FaRegCalendarAlt className="text-primary-light text-2xl md:text-3xl" />
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              Ключевые события <span className="text-primary-light">Великой Отечественной Войны</span>
            </h2>
          </div>
          <Timeline />
        </div>
        <div className="absolute bottom-0 right-0">
          <svg width="400" height="400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-5">
            <path d="M42.2,71.3c6.5-10.9,5.3-22.8-2.1-27.4c-7.4-4.6-18.4-1-26.4,8.4C5.7,61.7,2.8,74.6,8.9,80.5
                  C15,86.4,27.4,85.3,37.6,77.5" stroke="var(--primary)" strokeWidth="0.5" />
            <path d="M149.8,63.6c11.2-23.9,31.6-35.7,46.3-26.6s14.4,34.3,0.8,57.4s-35.2,37.7-48.2,27.7
                  C135.8,112,138.6,87.5,151.1,67.5" stroke="var(--primary)" strokeWidth="0.5" />
            <path d="M73.1,138.2c5.2-12.9,22.1-15.9,37.9-7.2c10.6,5.9,18.9,16.2,21.7,25.5" stroke="var(--primary)" strokeWidth="0.5" />
          </svg>
        </div>
      </section>
            <section className="py-20 relative">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-12 justify-center">
            <FaRegNewspaper className="text-primary-light text-2xl md:text-3xl" />
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              Новости и <span className="text-primary-light">анонсы мероприятий</span>
            </h2>
          </div>
          <News />
        </div>
      </section>
            <section className="py-20 relative frost-bg">
        <div className="container-custom text-center relative z-10">
          <div className="flex items-center gap-4 mb-8 justify-center">
            <FaRegClock className="text-accent text-2xl md:text-3xl" />
            <h2 className="text-3xl md:text-4xl font-bold text-shadow">
              До <span className="text-gradient">80-летия</span> Великой Победы
            </h2>
          </div>
          <Countdown targetDate="2025-05-09T00:00:00" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/bg-pattern.svg')] opacity-5 z-0"></div>
      </section>
            <section className="py-20 bg-primary/10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center gap-4 mb-6 justify-center">
              <FaUsers className="text-primary-light text-2xl md:text-3xl" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Сохраним память <span className="text-primary-light">вместе</span>
              </h2>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Присоединяйтесь к проекту, добавляйте информацию о своих родственниках-героях, 
              участвуйте в сохранении исторической памяти о подвиге народа.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/heroes" className="px-8 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-all hover-lift">
                Добавить героя
              </a>
              <a href="/interactive" className="px-8 py-3 bg-secondary hover:bg-secondary/70 text-white font-semibold rounded-lg transition-all hover-lift">
                Пройти тесты
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
