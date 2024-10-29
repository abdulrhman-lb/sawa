import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Content from './Content';
import ScrollBar from '@/Components/ScrollBar';
import Title from '@/Components/Title';
import { IoHomeOutline } from 'react-icons/io5';

export default function Index({ 
  auth, 
  categories, 
  message, 
 }) {

  const numberOfCategories = categories.data.length

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center w-full">
          <ScrollBar message={message} >
            <Title className="flex">
              <IoHomeOutline className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              اللوحة الرئيسية
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="الرئيسية" />
      <div className="dark:bg-gray-900 dark:text-white pt-2 mx-auto max-w-7xl">
        <div className={`grid grid-cols-1 md:grid-cols-3 ${numberOfCategories > 3 ? 'lg:grid-cols-3' : `lg:grid-cols-${numberOfCategories}`} gap-10`}>
          {(categories.data.length) === 0 ? (
            <div className="lg:col-span-10 p-5">
              <p className="text-center text-gray-500">لا يوجد تصنيفات متاحة .</p>
            </div>
          ) : (
            categories.data.map((member, index) => (
              <>
                <Content key={index} {...member} />
              </>
            ))
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
