import PageHeader from '@/components/ui/PageHeader';
import QuizList from '@/components/interactive/QuizList';

export const metadata = {
  title: 'Тесты - Великая Отечественная Война',
  description: 'Интерактивные тесты на знание истории Великой Отечественной Войны. Проверьте свои знания о ключевых событиях и героях.',
};

export default function InteractivePage() {
  return (
    <div className="pt-20">
      <PageHeader 
        title="Интерактивные тесты" 
        description="Проверьте свои знания о Великой Отечественной войне"
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
    </div>
  );
} 