'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaVrCardboard, FaTimes, FaCube, FaMapMarkedAlt } from 'react-icons/fa';

// Специальный компонент для тура по Мамаеву кургану
const MamaevKurganTour = ({ url }: { url: string }) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-full h-12 z-10 bg-gray-900" 
        style={{ 
          /* Этот элемент будет перекрывать navbar сайта */
          height: '56px'
        }}
      />
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="Мамаев Курган - 3D Экскурсия"
        allowFullScreen
        style={{ 
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: '0',
          left: '0'
        }}
      />
    </div>
  );
};
const virtualTours = [
  {
    id: 1,
    title: 'Мамаев Курган',
    type: '3D-экскурсия',
    description: 'Официальная виртуальная экскурсия по мемориальному комплексу «Героям Сталинградской битвы»',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9qeqj85IhDLoRt3-4a1CyIf_Thh14W2LscA&s',
    tourUrl: 'https://mamaev-hill.ru/virtual-tour/vhod-01',
    location: 'Волгоград',
  },
  {
    id: 2,
    title: 'Дорога жизни',
    type: '3D-экскурсия',
    description: 'Виртуальный тур по ледовой трассе и музею «Дорога жизни» во время блокады Ленинграда',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcfazHxK85kHXa3KnbmEKadV_TxjrWI-FF6g&s',
    tourUrl: 'https://portfolio.3dpanorama.spb.ru/2019/doroga-jizni/v2/',
    location: 'Ленинградская область',
  },
];

export default function VirtualTourList() {
  const [selectedTour, setSelectedTour] = useState<number | null>(null);
  
  const handleClose = () => {
    setSelectedTour(null);
  };
  
  const selectedTourData = selectedTour !== null 
    ? virtualTours.find(tour => tour.id === selectedTour) 
    : null;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {virtualTours.map((tour, index) => (
          <motion.div 
            key={tour.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative h-48">
              <Image 
                src={tour.imageUrl} 
                alt={tour.title}
                fill
                className="object-cover"
                unoptimized // Решение для внешних изображений в демо-версии
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute bottom-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  tour.type === '3D-модель' ? 'bg-amber-600' : 'bg-primary'
                }`}>
                  {tour.type}
                </span>
                {tour.location && (
                  <span className="ml-2 text-xs bg-gray-800/80 px-2 py-1 rounded-full">
                    {tour.location}
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-xl mb-2">{tour.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{tour.description}</p>
              
              <button
                onClick={() => setSelectedTour(tour.id)}
                className={`w-full py-2 rounded flex items-center justify-center gap-2 ${
                  tour.type === '3D-модель' 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                    : 'bg-primary hover:bg-primary-light text-white'
                }`}
              >
                {tour.type === '3D-модель' ? <FaCube /> : <FaVrCardboard />}
                {tour.type === '3D-модель' ? 'Смотреть 3D-модель' : 'Начать экскурсию'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <AnimatePresence>
        {selectedTourData && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
            >
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Закрыть"
              >
                <FaTimes />
              </button>
              
              <div className="p-5 border-b border-gray-800">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {selectedTourData.type === '3D-модель' ? (
                    <>
                      <FaCube className="text-amber-500" /> 3D-модель: {selectedTourData.title}
                    </>
                  ) : (
                    <>
                      <FaMapMarkedAlt className="text-primary" /> Виртуальная экскурсия: {selectedTourData.title}
                    </>
                  )}
                </h3>
              </div>
              
              <div className="aspect-video">
                {selectedTourData.title === 'Мамаев Курган' ? (
                  <MamaevKurganTour url={selectedTourData.tourUrl || ''} />
                ) : (
                  <iframe
                    src={selectedTourData.type === '3D-модель' ? selectedTourData.modelUrl : selectedTourData.tourUrl}
                    className="w-full h-full border-0"
                    title={selectedTourData.title}
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              
              <div className="p-5">
                <p className="text-gray-300">{selectedTourData.description}</p>
                {selectedTourData.location && (
                  <p className="mt-2 text-gray-400 flex items-center gap-2">
                    <FaMapMarkedAlt /> {selectedTourData.location}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 