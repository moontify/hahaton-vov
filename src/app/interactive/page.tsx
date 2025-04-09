import PageHeader from '@/components/ui/PageHeader';
import QuizList from '@/components/interactive/QuizList';
import VirtualTourList from '@/components/interactive/VirtualTourList';

export const metadata = {
  title: 'Тесты и виртуальные экскурсии - Великая Отечественная Война',
  description: 'Интерактивные тесты и виртуальные 3D-экскурсии по местам боевой славы и памятникам Великой Отечественной Войны. Проверьте свои знания о ключевых событиях и героях.',
};

export default function InteractivePage() {
  return (
    <div className="pt-20">
      <PageHeader 
        title="Интерактивные материалы" 
        description="Проверьте свои знания и посетите виртуальные экскурсии"
        bgImage="/images/interactive-header.jpg"
      />
      
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Тесты на знание истории</h2>
            <p className="text-gray-400">
              Выберите один из тематических тестов и проверьте свои знания о важных событиях, 
              героях и фактах Великой Отечественной войны.
            </p>
          </div>
          
          <QuizList />
        </div>
      </section>
      
      <section className="py-16 bg-gray-900">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Виртуальные экскурсии</h2>
            <p className="text-gray-400">
              Исследуйте памятные места и важные объекты Великой Отечественной войны.
            </p>
          </div>
          
          <VirtualTourList />
        </div>
      </section>
    </div>
  );
} 