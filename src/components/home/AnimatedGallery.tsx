'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const galleryItems = [
  {
    id: 1,
    src: 'https://mgri.ru/upload/medialibrary/f8a/f8a3da222ab830e74cddbc59005d9379.jpg',
    alt: 'Знамя Победы над Рейхстагом',
    caption: 'Знамя Победы над Рейхстагом, 1945 г.',
    credit: 'Евгений Халдей'
  },
  {
    id: 2,
    src: 'https://historyrussia.org/images/Novosti-img/regnum_picture_1468165717_normal.jpg',
    alt: 'Блокада Ленинграда',
    caption: 'Блокада Ленинграда, 1941-1944 гг.',
    credit: 'Борис Кудояров'
  },
  {
    id: 3,
    src: 'https://www.pravoslavie.ru/sas/image/102833/283396.p.jpg?mtime=1517491070',
    alt: 'Сталинградская битва',
    caption: 'Сталинградская битва, 1942-1943 гг.',
    credit: 'Эммануил Евзерихин'
  },
  {
    id: 4,
    src: 'https://s1.stc.all.kpcdn.net/putevoditel/projectid_379258/images/tild3962-3164-4965-b361-346636373464__19450401_gaf_u39_002.jpg',
    alt: 'Берлинская операция',
    caption: 'Берлинская операция, апрель-май 1945 г.',
    credit: 'Георгий Самсонов'
  },
  {
    id: 5,
    src: 'https://upload.wikimedia.org/wikipedia/ru/6/61/%D0%9A%D1%83%D1%80%D1%81%D0%BA_1943.jpg',
    alt: 'Курская битва',
    caption: 'Курская битва, июль-август 1943 г.',
    credit: 'Иван Шагин'
  },
  {
    id: 6,
    src: 'https://cdnn21.img.ria.ru/images/07e5/09/0e/1749989806_0:213:2788:1781_1920x1080_80_0_0_eadb6981822d5f8a65a5238359c737c7.jpg',
    alt: 'Оборона Москвы',
    caption: 'Оборона Москвы, 1941 г.',
  }
];

export default function AnimatedGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectedImage !== null && event.target instanceof Element) {
        if (!event.target.closest('.gallery-modal-content')) {
          setSelectedImage(null);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedImage]);

  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  return (
    <div className="py-16" ref={galleryRef}>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Фотогалерея военных лет</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-amber-500 mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative group cursor-pointer overflow-hidden rounded-xl shadow-xl bg-gray-900 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedImage(index)}
          >
            <div className="aspect-w-4 aspect-h-3 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
              <Image 
                src={item.src}
                alt={item.alt}
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
              <h3 className="text-white font-bold text-xl group-hover:text-amber-300 transition-colors duration-300">{item.caption}</h3>
              <p className="text-gray-300 text-sm mt-1 flex items-center">
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      {selectedImage !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative max-w-5xl mx-auto gallery-modal-content w-full p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              className="absolute top-4 right-4 z-10 bg-black/60 text-white rounded-full p-3 hover:bg-black/80 transition-colors shadow-lg"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
              <div className="relative aspect-w-16 aspect-h-9">
                <Image
                  src={galleryItems[selectedImage].src}
                  alt={galleryItems[selectedImage].alt}
                  width={800}
                  height={600}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="bg-gray-900 p-6 border-t border-gray-800">
                <h3 className="text-2xl text-white font-bold mb-2">
                  {galleryItems[selectedImage].caption}
                </h3>
              </div>
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <button
                className="bg-black/60 hover:bg-black/80 text-white p-4 rounded-full transition-colors shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage === 0 ? galleryItems.length - 1 : selectedImage - 1);
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <button
                className="bg-black/60 hover:bg-black/80 text-white p-4 rounded-full transition-colors shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage === galleryItems.length - 1 ? 0 : selectedImage + 1);
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 