import { Metadata } from 'next';
import PageHeader from '@/components/ui/PageHeader';
import TeacherResources from '@/components/education/TeacherResources';
import LessonPlans from '@/components/education/LessonPlans';
import DownloadMaterials from '@/components/education/DownloadMaterials';
import TeacherWorkshop from '@/components/education/TeacherWorkshop';
import InteractiveAssignments from '@/components/interactive/InteractiveAssignments';

export const metadata: Metadata = {
  title: 'Учителям | Интерактивный портал о Великой Отечественной войне',
  description: 'Методические материалы, планы уроков и учебные пособия для преподавателей',
};

export default function TeachersPage() {
  return (
    <main className="min-h-screen">
      <PageHeader 
        title="Учителям" 
        description="Методические материалы, планы уроков и полезные ресурсы для преподавателей"
        bgImage="/images/headers/teachers.jpg"
      />

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Методические разработки</h2>
        <TeacherResources />
      </section>

      <section className="container mx-auto px-4 py-12 bg-gray-900">
        <h2 className="text-3xl font-bold mb-8">Готовые планы уроков</h2>
        <LessonPlans />
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Материалы для скачивания</h2>
        <DownloadMaterials />
      </section>
    </main>
  );
} 