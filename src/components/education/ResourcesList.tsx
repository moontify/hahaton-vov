'use client';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGlobe, FaUniversity, FaBook, FaArchive, FaFilm, FaUserEdit } from 'react-icons/fa';

const resources = [
  {
    id: 1,
    title: 'Портал "Память народа"',
    description: 'Общедоступный электронный банк документов о Великой Отечественной войне. Здесь можно найти информацию о награждениях, боевом пути, местах службы и захоронений участников войны.',
    link: 'https://pamyat-naroda.ru/',
    category: 'Архивы',
    icon: <FaArchive className="w-6 h-6 text-primary" />,
  },
  {
    id: 2,
    title: 'ОБД "Мемориал"',
    description: 'Обобщенный банк данных о защитниках Отечества, погибших, умерших и пропавших без вести в период Великой Отечественной войны и послевоенный период.',
    link: 'https://obd-memorial.ru/',
    category: 'Архивы',
    icon: <FaArchive className="w-6 h-6 text-primary" />,
  },
  {
    id: 3,
    title: 'Российская государственная библиотека',
    description: 'Крупнейшая в стране библиотека с обширной коллекцией материалов о Великой Отечественной войне, включая книги, газеты, журналы и архивные документы.',
    link: 'https://rsl.ru/',
    category: 'Библиотеки',
    icon: <FaBook className="w-6 h-6 text-primary" />,
  },
  {
    id: 4,
    title: 'Музей Победы',
    description: 'Официальный сайт центрального музея Великой Отечественной войны на Поклонной горе в Москве с виртуальными экскурсиями и образовательными программами.',
    link: 'https://victorymuseum.ru/',
    category: 'Музеи',
    icon: <FaUniversity className="w-6 h-6 text-primary" />,
  },
  {
    id: 5,
    title: 'Военно-исторический портал "Warheroes"',
    description: 'Сайт, посвященный Героям Советского Союза и Героям России. Содержит биографии, фотографии и описания подвигов.',
    link: 'http://warheroes.ru/',
    category: 'Исторические порталы',
    icon: <FaGlobe className="w-6 h-6 text-primary" />,
  },
  {
    id: 6,
    title: 'Исторический портал "Победители"',
    description: 'Проект, посвященный 60-летию Победы в Великой Отечественной войне, с интерактивной картой военных действий и базой данных ветеранов.',
    link: 'https://победители.рф/',
    category: 'Исторические порталы',
    icon: <FaGlobe className="w-6 h-6 text-primary" />,
  },
  {
    id: 7,
    title: 'Киностудия "Мосфильм"',
    description: 'Архив классических советских фильмов о Великой Отечественной войне, многие из которых можно смотреть бесплатно онлайн.',
    link: 'https://cinema.mosfilm.ru/',
    category: 'Кинематограф',
    icon: <FaFilm className="w-6 h-6 text-primary" />,
  },
  {
    id: 8,
    title: 'Военная литература "Милитера"',
    description: 'Электронная библиотека военно-исторической литературы, включающая мемуары, дневники, исследования и документы о войне.',
    link: 'http://militera.lib.ru/',
    category: 'Литература',
    icon: <FaUserEdit className="w-6 h-6 text-primary" />,
  },
];

export default function ResourcesList() {
  const resourcesByCategory = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);

  return (
    <div className="space-y-10">
      {Object.entries(resourcesByCategory).map(([category, categoryResources], catIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: catIndex * 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold mb-6 text-accent">{category}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categoryResources.map((resource, resIndex) => (
              <motion.div
                key={resource.id}
                className="bg-card rounded-lg p-6 border border-border shadow-md hover:border-primary/30 hover:shadow-lg transition-all"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: (catIndex * 0.1) + (resIndex * 0.05) }}
                viewport={{ once: true }}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    {resource.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{resource.title}</h4>
                    <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-light hover:text-accent transition-colors"
                    >
                      Посетить ресурс <FaExternalLinkAlt className="ml-2 w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
} 