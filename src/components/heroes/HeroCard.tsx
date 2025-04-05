'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMedal, FaMapMarkerAlt, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { Hero } from '@/types';

interface HeroCardProps {
  hero: Hero;
}

export default function HeroCard({ hero }: HeroCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    id,
    name,
    rank,
    region,
    description,
    years,
    photo,
    awards
  } = hero;
  
  // Ограничиваем описание до 100 символов для превью
  const shortDescription = description.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;
  
  return (
    <motion.div
      className="bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all h-full flex flex-col"
      whileHover={{ y: -5, scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-52 w-full">
        <Image
          src={photo || '/images/heroes/placeholder.jpg'}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-2 px-4">
          <div className="flex items-center text-xs text-gray-300">
            <FaCalendarAlt className="text-primary-light mr-1" />
            <span>{years}</span>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center text-gray-400">
            <FaMapMarkerAlt className="text-primary-light mr-2" />
            <span>{region}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <FaMedal className="text-primary-light mr-2" />
            <span>{rank}</span>
          </div>
        </div>
        
        {awards && awards.length > 0 && (
          <div className="mb-3">
            <div className="text-sm text-gray-400 mb-1">Награды:</div>
            <div className="flex flex-wrap gap-1">
              {awards.slice(0, 3).map((award, index) => (
                <span 
                  key={index} 
                  className="bg-background-light text-xs px-2 py-1 rounded-full text-gray-300"
                >
                  {award}
                </span>
              ))}
              {awards.length > 3 && (
                <span className="bg-background-light text-xs px-2 py-1 rounded-full text-gray-300">
                  +{awards.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        <p className="text-gray-400 text-sm mb-4 flex-grow">
          {shortDescription}
        </p>
        
        <Link href={`/heroes/${id}`} className="mt-auto">
          <motion.div 
            className="flex items-center justify-center w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-md transition-colors group"
            animate={{ 
              backgroundColor: isHovered ? 'rgba(220, 38, 38, 0.3)' : 'rgba(220, 38, 38, 0.2)'
            }}
          >
            <span>Подробнее</span>
            <motion.span
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronRight className="ml-2" />
            </motion.span>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
} 