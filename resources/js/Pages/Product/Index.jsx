import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Content from './Content';
import { useState } from 'react';
import ScrollBar from '@/Components/ScrollBar';
import SuccessMessage from '@/Components/SuccessMessage';
import Title from '@/Components/Title';
import { AiOutlineProduct } from 'react-icons/ai';

export default function Index({ 
  auth, 
  products, 
  success, 
  message, 
  initialNotifications
 }) {

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.data.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      notification={initialNotifications}
      header={
        <div className='flex justify-between items-center'>
          <ScrollBar message={message}>
            <nav className="text-me text-gray-800 dark:text-gray-200 flex justify-between items-center">
              <Title className="flex">
                <AiOutlineProduct className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
                المنتجات
              </Title>
              <Link href="/" className="hover:underline px-2"> التصنيفات </Link> &gt;
              <span className="text-gray-500 p-2 text-nowrap">{products.data.length > 0 && products.data[0].category.name}</span> {/* الصفحة الحالية */}
            </nav>
            <div className="bg-gray-100 dark:bg-gray-900 dark:text-white">
              <div className="">
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  className=" border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </ScrollBar>
        </div>
      }
    >
      <Head title="المنتجات" />
      <div className=" dark:text-white pt-1 mx-auto max-w-7xl">
        {success && (<SuccessMessage message={success} />)}
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
