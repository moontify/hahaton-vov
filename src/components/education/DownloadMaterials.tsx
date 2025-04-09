'use client';
import { motion } from 'framer-motion';
import { FaFileAlt, FaFilePdf, FaFileWord, FaFileImage, FaFilePowerpoint, FaDownload, FaSearch } from 'react-icons/fa';
import { useState } from 'react';

// Данные о материалах для скачивания
const downloadableMaterials = [
  {
    id: 1,
    title: 'Плакаты времен Великой Отечественной войны',
    type: 'Изображения',
    category: 'Наглядные материалы',
    format: 'PDF',
    description: 'Набор из 20 высококачественных плакатов военного времени для оформления класса и использования на уроках истории.',
    size: '15 МБ',
    downloadUrl: 'https://documents.infourok.ru/df257dcf-02b6-4444-b0c4-74e6f4af8180/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D1%83%D1%80%D0%BE%D0%BA%D0%B0%20%D0%BD%D0%B0%20%D1%82%D0%B5%D0%BC%D1%83%20%22%D0%9D%D0%B0%D1%87%D0%B0%D0%BB%D0%BE%20%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%B9%20%D0%9E%D1%82%D0%B5%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9%20%D0%B2%D0%BE%D0%B9%D0%BD%D1%8B%22%20%289%20%D0%BA%D0%BB%D0%B0%D1%81%D1%81%29..pdf',
    icon: <FaFileImage className="text-blue-400" size={20} />,
  },
  {
    id: 2,
    title: 'Рабочая тетрадь "Герои Великой Отечественной войны"',
    type: 'Рабочая тетрадь',
    category: 'Раздаточные материалы',
    format: 'PDF',
    description: 'Рабочая тетрадь с заданиями разного уровня сложности, биографиями героев и историческими справками.',
    size: '8.5 МБ',
    downloadUrl: 'https://documents.infourok.ru/724ef864-ea45-447f-b7c1-673a71198af4/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D0%BB%D0%B8%D1%81%D1%82%20%22%D0%91%D0%BB%D0%BE%D0%BA%D0%B0%D0%B4%D0%B0%20%D0%9B%D0%B5%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%D0%B0%22.docx',
    icon: <FaFilePdf className="text-red-400" size={20} />,
  },
  {
    id: 3,
    title: 'Презентация "Основные сражения ВОВ"',
    type: 'Презентация',
    category: 'Демонстрационные материалы',
    format: 'PPTX',
    description: 'Детальная презентация с картами, схемами и фотографиями основных сражений Великой Отечественной войны.',
    size: '22 МБ',
    downloadUrl: 'https://documents.infourok.ru/ce97472e-f08d-4c68-aeb1-21e4e7393beb/%D0%9F%D1%80%D0%B5%D0%B7%D0%B5%D0%BD%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BF%D0%BE%20%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8%20%D0%BD%D0%B0%20%D1%82%D0%B5%D0%BC%D1%83%20%22%20%D0%9E%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5%20%D1%81%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%B9%20%D0%9E%D1%82%D0%B5%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9%20%D0%B2%D0%BE%D0%B9%D0%BD%D1%8B%201941-1945%20%D0%B3.%D0%B3.%22.pptx',
    icon: <FaFilePowerpoint className="text-orange-400" size={20} />,
  },
  {
    id: 4,
    title: 'Тесты по хронологии Великой Отечественной войны',
    type: 'Тесты',
    category: 'Контрольно-измерительные материалы',
    format: 'PDF',
    description: 'Набор тестовых заданий разного уровня сложности для проверки знаний учащихся о ключевых датах и событиях войны.',
    size: '3.2 МБ',
    downloadUrl: 'https://nbdrx.ru/razdeli/news/doc/arh2633_base.pdf',
    icon: <FaFileWord className="text-blue-500" size={20} />,
  },
  {
    id: 5,
    title: 'Инфографика "Техника и вооружение времен ВОВ"',
    type: 'Инфографика',
    category: 'Наглядные материалы',
    format: 'PDF',
    description: 'Красочная инфографика с техническими характеристиками и сравнением вооружения советской и немецкой армий.',
    size: '12 МБ',
    downloadUrl: 'https://angtu.ru/universitet/Nauchny_polk/Timofeev.pdf',
    icon: <FaFilePdf className="text-red-400" size={20} />,
  },
  {
    id: 6,
    title: 'Методическая разработка внеклассного мероприятия ко Дню Победы',
    type: 'Методическая разработка',
    category: 'Сценарии мероприятий',
    format: 'DOCX',
    description: 'Подробный сценарий проведения школьного мероприятия, посвященного Дню Победы, с музыкальным сопровождением и декорациями.',
    size: '5.7 МБ',
    downloadUrl: 'https://documents.infourok.ru/64a4cd6e-a61d-4f44-96f4-847d9f668e6b/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D0%92%D0%BD%D0%B5%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BC%D0%B5%D1%80%D0%BE%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D1%8F%20%D0%BF%D0%BE%D1%81%D0%B2%D1%8F%D1%89%D1%91%D0%BD%D0%BD%D0%BE%D0%B5%2075-%D0%BB%D0%B5%D1%82%D0%B8%D1%8E%20%D0%9F%D0%BE%D0%B1%D0%B5%D0%B4%D1%8B%20%D0%B2%20%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%B9%20%D0%9E%D1%82%D0%B5%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9%20%D0%B2%D0%BE%D0%B9%D0%BD%D0%B5%20%C2%AB%D0%9D%D0%B5%20%D0%B7%D0%B0%D0%B1%D1%83%D0%B4%D0%B5%D0%BC%20%D1%8D%D1%82%D0%BE%20%D0%BD%D0%B8%D0%BA%D0%BE%D0%B3%D0%B4%D0%B0%C2%BB.docx',
    icon: <FaFileWord className="text-blue-500" size={20} />,
  },
];

// Варианты для фильтрации
const categories = [
  'Все категории',
  'Наглядные материалы',
  'Раздаточные материалы',
  'Демонстрационные материалы',
  'Контрольно-измерительные материалы',
  'Сценарии мероприятий',
  'Оформление',
];

const types = [
  'Все типы',
  'Изображения',
  'Рабочая тетрадь',
  'Презентация',
  'Тесты',
  'Инфографика',
  'Методическая разработка',
  'Карточки',
  'Шаблоны',
];

export default function DownloadMaterials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [selectedType, setSelectedType] = useState('Все типы');
  
  // Фильтрация материалов
  const filteredMaterials = downloadableMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все категории' || material.category === selectedCategory;
    const matchesType = selectedType === 'Все типы' || material.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });
  
  // Функция получения PDF иконки
  const getFileIcon = (material: typeof downloadableMaterials[0]) => {
    return material.icon || <FaFileAlt className="text-gray-400" size={20} />;
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск материалов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Категория</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Тип материала</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material, index) => (
          <motion.div
            key={material.id}
            className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                {getFileIcon(material)}
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                  {material.size}
                </span>
              </div>
              
              <h3 className="text-lg font-bold mb-2 line-clamp-2">{material.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{material.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{material.category}</span>
                <span className="bg-primary/10 text-primary-light px-2 py-1 rounded text-xs">
                  {material.format}
                </span>
              </div>
              
              <a
                href={material.downloadUrl}
                className="w-full bg-primary hover:bg-primary-light text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
                download
              >
                <FaDownload size={14} /> Скачать материал
              </a>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredMaterials.length === 0 && (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-gray-400 mb-2">По вашему запросу ничего не найдено</p>
          <p className="text-gray-500 text-sm">Попробуйте изменить параметры поиска</p>
        </div>
      )}
      
      <div className="mt-8 p-6 bg-blue-900/30 rounded-lg border border-blue-800/30">
        <h3 className="text-xl font-bold mb-4">Хотите поделиться своими материалами?</h3>
        <p className="text-gray-300 mb-4">
          Если у вас есть авторские методические разработки, презентации или другие материалы для учителей,
          вы можете поделиться ими с сообществом педагогов.
        </p>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded transition-colors">
          Предложить материал
        </button>
      </div>
    </div>
  );
} 