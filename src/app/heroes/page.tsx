import PageHeader from '@/components/ui/PageHeader';
import HeroesSearch from '@/components/heroes/HeroesSearch';
import HeroesGrid from '@/components/heroes/HeroesGrid';
import HeroesAddForm from '@/components/heroes/HeroesAddForm';
import { FaInfoCircle, FaUserShield, FaSync } from 'react-icons/fa';

export const metadata = {
  title: 'Галерея героев - Великая Отечественная Война',
  description: 'Информация о героях Великой Отечественной Войны. Поиск по региону и населенному пункту. Возможность добавить информацию о своих родственниках-участниках войны.',
};

// Скрипт для проверки localStorage
const HeroesPageScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            // Проверяем localStorage на наличие героев
            const storedHeroes = localStorage.getItem('heroes');
            if (storedHeroes) {
              const heroes = JSON.parse(storedHeroes);
              
              // Проверяем, есть ли героев с id > 5 (добавленные пользователем)
              const userAddedHeroes = heroes.filter(hero => parseInt(hero.id) > 5);
              if (userAddedHeroes.length > 0) {
                
                // Добавляем индикатор на страницу
                const indicator = document.createElement('div');
                indicator.style.position = 'fixed';
                indicator.style.bottom = '20px';
                indicator.style.right = '20px';
                indicator.style.background = '#fbbf24';
                indicator.style.color = '#1f2937';
                indicator.style.padding = '10px 20px';
                indicator.style.borderRadius = '8px';
                indicator.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                indicator.style.zIndex = '9999';
                indicator.style.fontWeight = 'bold';
                indicator.textContent = 'Герои загружены успешно!';
                
                document.body.appendChild(indicator);
                
                // Убираем индикатор через 5 секунд
                setTimeout(() => {
                  indicator.remove();
                }, 5000);
              }
            }
          } catch (error) {
            console.error('Ошибка при проверке героев в localStorage:', error);
          }
        `
      }}
    />
  );
};

export default function HeroesPage() {
  return (
    <div className="pt-20">
      <HeroesPageScript />
      
      <PageHeader 
        title="Галерея героев" 
        description="Истории о подвигах и доблести защитников Отечества"
        bgImage=""
      />
      
      <div className="container-custom mt-8">
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-4 mb-8 flex items-start gap-4">
          <div className="text-amber-500 pt-1">
            <FaSync size={20} />
          </div>
          <div>
            <h3 className="text-amber-400 font-bold mb-1">Важно: Обновление информации</h3>
            <p className="text-gray-300 text-sm mb-1">
              После добавления героя необходимо <strong className="text-white bg-amber-700 px-2 py-0.5 rounded">обновить страницу</strong>, чтобы увидеть добавленную информацию в галерее.
              Это требуется только в демо-версии сайта.
            </p>
            <p className="text-amber-500/80 text-xs">
              В полной версии сайта информация будет обновляться автоматически после успешного добавления.
            </p>
            <a 
              href="/heroes" 
              className="mt-2 bg-amber-700 hover:bg-amber-600 text-white px-4 py-1 rounded-md text-sm flex items-center gap-2 inline-block w-fit"
            >
              <FaSync size={14} /> Обновить страницу сейчас
            </a>
          </div>
        </div>
        
        <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4 mb-8 flex items-start gap-4">
          <div className="text-blue-500 pt-1">
            <FaUserShield size={20} />
          </div>
          <div>
            <h3 className="text-blue-400 font-bold mb-1">Политика модерации</h3>
            <p className="text-gray-300 text-sm">
              В полной версии сервиса все добавленные герои будут отображаться только у вас, 
              пока не пройдут проверку модераторами. После успешной модерации данные станут доступны 
              в общей галерее героев для всех пользователей.
            </p>
          </div>
        </div>
      
      </div>
      
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Найдите героя войны</h2>
            <p className="text-gray-400">
              Воспользуйтесь поиском, чтобы найти информацию о героях войны по региону или населенному пункту.
            </p>
          </div>
          <HeroesSearch />
        </div>
      </section>
      <section className="py-16 bg-card">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Герои Великой Отечественной Войны</h2>
          <HeroesGrid />
        </div>
      </section>
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Добавить героя</h2>
            <p className="text-gray-400 text-center mb-8">
              Здесь вы можете добавить информацию о своих родственниках-участниках войны, чтобы сохранить память о них.
            </p>
            <HeroesAddForm />
          </div>
        </div>
      </section>
    </div>
  );
} 