import PageHeader from '@/components/ui/PageHeader';
import HeroesSearch from '@/components/heroes/HeroesSearch';
import HeroesGrid from '@/components/heroes/HeroesGrid';
import HeroesAddForm from '@/components/heroes/HeroesAddForm';
import { FaInfoCircle, FaUserShield, FaSync } from 'react-icons/fa';

export const metadata = {
  title: 'Галерея героев - Великая Отечественная Война',
  description: 'Информация о героях Великой Отечественной Войны. Поиск по региону и населенному пункту. Возможность добавить информацию о своих родственниках-участниках войны.',
};

export default function HeroesPage() {
  return (
    <div className="pt-20">
      <PageHeader 
        title="Галерея героев" 
        description="Истории о подвигах и доблести защитников Отечества"
        bgImage=""
      />
      
      <div className="container-custom mt-8">
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