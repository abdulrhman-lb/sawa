import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Content from './Content';
import { useState } from 'react';


export default function Index({ auth, products, success }) {
  const [searchTerm, setSearchTerm] = useState('');

  // تصفية المنتجات بناءً على النص الذي يدخل المستخدم
  const filteredProducts = products.data.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className='flex justify-between items-center'>
          <nav className="text-me text-gray-800 dark:text-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight ml-10">المنتجات</h2>
            <Link href="/" className="hover:underline p-2"> التصنيفات </Link> &gt; {/* رابط للصفحة الرئيسية */}
            <span className="text-gray-500 p-2">{products.data.length > 0 && products.data[0].category.name}</span> {/* الصفحة الحالية */}
          </nav>
          <div className="bg-gray-100 dark:bg-gray-900 dark:text-white">
            <div className="">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                className="w-full border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      }
    >
      <Head title="المنتجات" />
      <div className="bg-gray-100 dark:bg-gray-900 dark:text-white pt-6 mx-auto max-w-7xl">
        {success && (<div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
          {success}
        </div>)}
        {products.data.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          {
            filteredProducts.map((member) => (
              <>
                <Content key={member.id} {...member} />
              </>
            ))
          }
        </div>
        ) : (
          <div className="lg:col-span-10 p-5">
            <p className="text-center text-gray-500">لا يوجد منتجات متوفرة.</p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
