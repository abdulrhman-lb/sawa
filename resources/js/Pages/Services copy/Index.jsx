import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Content from './Content';
import { useState } from 'react';


export default function Index({ auth, services }) {
  // حالة لتتبع نص البحث
  const [searchTerm, setSearchTerm] = useState('');

  // تصفية المنتجات بناءً على النص الذي يدخل المستخدم
  const filteredServices = services.data.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className='flex justify-between items-center'>
          {/* مسار Breadcrumb */}
          <nav className="text-me text-gray-800 dark:text-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight ml-10"> المنتجات </h2>
            <Link href="/" className="hover:underline p-2"> التصنيفات </Link> &nbsp;&gt;&nbsp;&nbsp;&nbsp; {/* رابط للصفحة الرئيسية */}
            <Link href={`/products?id=${services.data[0].product.category.id}`} className="hover:underline">{services.data[0].product.category.name}</Link> &nbsp;&nbsp;&nbsp;&gt;&nbsp;
            <span className="text-gray-500 p-2">{services.data[0].product.name}</span>
          </nav>
          <div className="bg-gray-100 dark:bg-gray-900 dark:text-white">
            <div className="">
              <input
                type="text"
                placeholder="ابحث عن خدمة..."
                className="w-full border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      }
    >
      <Head title="الخدمات" />
      <div className="bg-gray-100 dark:bg-gray-900 dark:text-white pt-6 max-w-7xl grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        <div className=" gap-10">
          {
            filteredServices.map((member) => (
              <>
                <Content key={member.id} {...member} />
              </>
            ))
          }
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
