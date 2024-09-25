import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Content from './Content';
import ScrollBar from '@/Components/ScrollBar';
import Title from '@/Components/Title';


export default function Index({ auth, categories, message }) {
  const numberOfCategories = categories.data.length
  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <Title>اللوحة الرئيسية</Title>
          <ScrollBar message={message} />
        </div>
      }
    >
      <Head title="الرئيسية" />
      <div className="bg-gray-100 dark:bg-gray-900 dark:text-white pt-4 mx-auto max-w-7xl">
        {/* Blogs Card */}
        <div className={`grid grid-cols-1 md:grid-cols-3 ${numberOfCategories > 3 ? 'lg:grid-cols-3' : `lg:grid-cols-${numberOfCategories}`} gap-10`}>
          {(categories.data.length) === 0 ? (
            <div className="lg:col-span-10 p-5">
              <p className="text-center text-gray-500">لا يوجد تصنيفات متاحة .</p>
            </div>
          ) : (
            categories.data.map((member) => (
              <>
                <Content key={member.id} {...member} />
              </>
            ))
          )}

        </div>

      </div>

    </AuthenticatedLayout>
  );
}
