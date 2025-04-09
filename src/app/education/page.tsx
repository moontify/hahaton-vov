import PageHeader from '@/components/ui/PageHeader';
import FilmsList from '@/components/education/FilmsList';
import BooksList from '@/components/education/BooksList';
import ResourcesList from '@/components/education/ResourcesList';
import { FaChalkboardTeacher } from 'react-icons/fa';

export const metadata = {
  title: 'Образовательные материалы - Великая Отечественная Война',
  description: 'Подборки фильмов, книг и образовательных ресурсов о Великой Отечественной Войне.',
};

export default function EducationPage() {
  return (
    <div className="pt-20">
      <PageHeader 
        title="Образовательные материалы" 
        description="Книги, фильмы и ресурсы о Великой Отечественной войне"
        bgImage=""
      />
      
      <section className="py-8 bg-primary/10">
        <div className="container-custom">
          <div className="bg-card/70 border border-primary/20 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaChalkboardTeacher className="text-primary-light text-2xl" />
              <h2 className="text-2xl font-bold">Материалы для учителей</h2>
            </div>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
              Специальный раздел для педагогов с методическими разработками, готовыми планами уроков 
              и материалами для организации образовательного процесса по теме Великой Отечественной войны.
            </p>
            <a 
              href="/education/teachers" 
              className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-all hover:shadow-lg inline-block"
            >
              Перейти в раздел для учителей
            </a>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Фильмы о Великой Отечественной войне</h2>
          <FilmsList />
        </div>
      </section>
      <section className="py-16 bg-card">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Книги о войне</h2>
          <BooksList />
        </div>
      </section>
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Полезные ресурсы</h2>
          <ResourcesList />
        </div>
      </section>
    </div>
  );
} 