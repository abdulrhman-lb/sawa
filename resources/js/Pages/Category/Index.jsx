import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Content from './Content';


export default function Index({ auth, categories }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">اللوحة الرئيسية</h2>}
    >
      <Head title="الرئيسية" />
      <div className="bg-gray-100 dark:bg-gray-900 dark:text-white pt-6 mx-auto max-w-7xl">
      
          {/* Blogs Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
            {
              categories.data.map((member) => (
                <Content key={member.id} {...member} />
              ))
            }
          </div>
        
      </div>

    </AuthenticatedLayout>
  );
}
