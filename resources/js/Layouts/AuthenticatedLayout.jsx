import React, { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Pages/Navbar/NavLink';
import { Link, router, usePage } from '@inertiajs/react';
import DarkMode from '@/Pages/Navbar/DarkMode';
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import ResponsiveMenu from '@/Pages/Navbar/ResponsiveMenu';
import Footer from '@/Components/Footer';
import AOS from "aos";
import "aos/dist/aos.css";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import AcceptButton from '@/Components/Buttons/AcceptButton';
import RejectButton from '@/Components/Buttons/RejectButton copy';

export default function AuthenticatedLayout({ user, header, children, message }) {
  const { props } = usePage();
  const userBalance = props.user_balance;
  const [showMenu, setShowMenu] = useState(false);
  const image = (user.image != null && user.image != '') ? user.image : '/images/profiles/noimage.jpg';
  const [addBalanceError, setAddBalanceError] = useState('');
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [addBalance, setAddBalance] = useState(0);

  const links = [
    { id: 1, name: 'الرئيسية', link: 'category.home', kind: 1, dropdown: false, down: [] },
    {
      id: 6, name: 'طلبات المراكز', link: 'order.index', kind: 2, dropdown: true, down: [
        { id: 61, name: 'معالجة الطلبات', link: 'order.index', requiredRole: ['admin', 'super_user'] },
        { id: 62, name: 'إجمالي الطلبات', link: 'order.home', requiredRole: ['admin', 'super_user'] },
      ]
    },
    {
      id: 2, name: 'القسم المالي', link: 'task.index', kind: 2, dropdown: true, down: [
        { id: 22, name: 'إضافة رصيد المنتجات', link: 'product.balances.home', requiredRole: ['admin'] },
        { id: 23, name: 'حسابات المراكز', link: 'center.balances.home', requiredRole: ['admin', 'super_user'] },
        { id: 25, name: 'نفقات ومصاريف', link: 'box.index', requiredRole: ['admin'] },
        { id: 26, name: 'حركة الصندوق اليومية', link: 'box.home', requiredRole: ['admin'] },
        { id: 27, name: 'إجمالي البيان المالي', link: 'capital.index', requiredRole: ['admin'] },
        { id: 28, name: 'أسعار تفاصيل الخدمات', link: 'amountkind.index', requiredRole: ['admin'] },
        // { id: 29, name: 'تحديد نسبة العمولة', link: 'comission.index', requiredRole: ['admin', 'super_user'] },
        // { id: 30, name: ' نسبة العمولة', link: 'comission-new.index', requiredRole: ['admin', 'super_user'] },
      ]
    },
    { id: 3, name: 'الزبائن', link: 'customer.index', kind: 1, dropdown: false, down: [] },
    {
      id: 4, name: 'مراكز التوزيع', link: 'user.index', kind: 2, dropdown: true, down: [
        { id: 41, name: 'إضافة', link: 'user.index', requiredRole: ['admin', 'super_user'] },
        { id: 42, name: 'السماحيات', link: 'category-permission.index', requiredRole: ['admin', 'super_user'] },
        { id: 43, name: ' نسبة العمولة', link: 'comission-new.index', requiredRole: ['admin', 'super_user'] },
      ]
    },
    {
      id: 5, name: 'لوحة التحكم', link: 'dashboard.home', kind: 3, dropdown: true, down: [
        { id: 51, name: 'التصنيفات', link: 'category.index', requiredRole: ['admin', 'super_user'] },
        // { id: 52, name: 'صلاحيات التصنيفات', link: 'category-permission.index', requiredRole: ['admin'] },
        { id: 53, name: 'المنتجات', link: 'product.index', requiredRole: ['admin', 'super_user'] },
        { id: 54, name: 'أنواع بيانات الخدمات', link: 'datakind.index', requiredRole: ['admin', 'super_user'] },
        { id: 55, name: 'الخدمات', link: 'service.index', requiredRole: ['admin', 'super_user'] },
        { id: 56, name: 'تفاصيل الخدمات', link: 'kind.index', requiredRole: ['admin'] },
        { id: 59, name: 'إعدادات', link: 'settings.edit', requiredRole: ['admin'] },
      ]
    },
  ];
  const openAddBalanceModal = () => {
    setShowAddBalanceModal(true);
  }

  const handleAddBalance = () => {
    if (addBalance < 0) {
      setAddBalanceError('القيمة يجب أن تكون أكبر أو يساوي الصفر');
    } else {
      setAddBalanceError('');
    }
    if (addBalance >= 0) {
      router.post(route('addBalance'), {
        addBalance: addBalance,
      });
      setShowAddBalanceModal(false);
      setAddBalanceError(0);
      setAddBalance(0);
    }
  }

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    AOS.init({ duration: 800, offset: 100, delay: 100 });
    AOS.refresh();
  }, []);

  // دالة للتحقق من صلاحيات الوصول
  const hasAccess = (requiredRoles) => {
    return requiredRoles.includes(user.kind);
  };

  const renderLinks = (links) => {
    return links.map(link => {
      const isAdmin = user.kind === 'admin' && link.kind <= 3 && link.kind != 1;
      const isSuperUser = user.kind === 'super_user' && link.kind <= 2;
      const isUser = user.kind === 'user' && link.kind <= 1;

      if (!isAdmin && !isSuperUser && !isUser) return null;
      const isDropdownActive = link.dropdown && link.down.some(downLink => route().current(downLink.link));
      if (!link.dropdown) {
        return (
          <li key={link.id} className="cursor-pointer">
            <NavLink href={route(link.link)} active={route().current(link.link)} >
              {link.name}
            </NavLink>
          </li>
        );
      }

      return (
        <Dropdown key={link.id}>
          <Dropdown.Trigger>
            <li className="cursor-pointer">
              <button className={
                'inline-flex items-center px-2 pt-4 pb-4 text-xl font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (isDropdownActive ? 'bg-red-600 text-white' : 'bg-blue-700 text-white hover:bg-blue-800 focus:border-gray-300') +
                ' border-transparent rounded-md'
              }>
                {link.name}
                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
            </li>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {link.down
              .filter(downLink => hasAccess(downLink.requiredRole)) // تحقق من صلاحيات الوصول قبل عرض الرابط
              .map(downLink => (
                <Dropdown.Link key={downLink.id} href={route(downLink.link)} isActive={route().current(downLink.link)}>
                  {downLink.name}
                </Dropdown.Link>
              ))}
          </Dropdown.Content>
        </Dropdown>
      );
    });
  };

  return (
    <>
      <Modal show={showAddBalanceModal} onClose={() => setShowAddBalanceModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">طلب رصيد </h2>
          <p className="mt-4">أدخل الرصيد الذي تريد طلبه</p>
          <div>
            <TextInput
              type="number"
              className="mt-4"
              placeholder="الرصيد"
              value={addBalance}
              min={0}
              onChange={(e) => setAddBalance(e.target.value)}
              lang="en"
            />
          </div>
          <InputError message={addBalanceError} className="mt-2" />
          <div className="mt-6 flex justify-end">
            <AcceptButton onClick={handleAddBalance}>موافق</AcceptButton>
            <RejectButton onClick={() => (setShowAddBalanceModal(false), setAddBalance(0), setAddBalanceError(''))}>إلغاء</RejectButton>
          </div>
        </div>
      </Modal>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <nav className="bg-slate-100 dark:bg-gray-800 dark:text-white duration-300 shadow-xl border-b border-gray-100 dark:border-gray-700 w-full justify-between">
          <div className="container py-3 md:py-2">
            <div className="flex justify-between items-center text-center mx-auto">
              {/* Desktop NavLinks */}
              <div className="hidden md:block lg:flex items-center space-x-1 gap-2 text-nowrap justify-between mx-auto">
                {/* Logo Section */}
                <div className="shrink-0 flex items-center px-2">
                  <Link href="/">
                    <div className="text-center mx-4 block fill-current">
                      <img src={message.image} className='rounded-full mx-auto w-[90px] h-[90px] lg:w-[80px] lg:h-[80px]' alt="" />
                    </div>
                  </Link>
                </div>
                <ul className="flex items-center space-x-1 gap-4 text-nowrap justify-between mx-auto">
                  {renderLinks(links)}
                </ul>

                <div className="flex items-center space-x-1 gap-4">
                  <a
                    className="flex px-2 pb-3 pt-3 text-lg bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font"
                    href={`https://api.whatsapp.com/send/?phone=963${message.support_number}&text&type=phone_number&app_absent=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    الدعم الفني
                    <FaWhatsapp className='m-1' />
                  </a>
                  {(user.kind != 'admin') ? (
                    <div className={`flex h-12 text-xl font-semibold rounded-md border-2 px-2  ${user.user_balance > 0 ? ' text-blue-600 border-blue-600' : (userBalance > 0 ? 'text-emerald-600 border-emerald-600' : 'text-red-600 border-red-600')}`}>
                      <div className='text-center my-auto'>
                        الرصيد:
                      </div>
                      <div className='text-center px-2 my-auto'>
                        {userBalance.toLocaleString('en-US')}
                      </div>
                      {(user.add_balance > 0) ? (
                        null
                      ) : (
                        <button onClick={() => openAddBalanceModal()}>
                          <IoMdAddCircle className='my-auto text-2xl text-emerald-600' />
                        </button>
                      )}

                    </div>
                  ) : (
                    null
                  )}

                </div>
                {/* User Dropdown */}
                <div className="hidden sm:flex sm:items-center sm:ms-6">
                  <Dropdown>
                    <Dropdown.Trigger>
                      <button className="inline-flex items-center px-1 py-1 text-md font-medium rounded-md text-gray-900 dark:text-gray-400 bg-slate-100 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                        <img src={image} className='rounded-full w-[60px] h-[60px] ml-2 border-2 border-gray-300' alt="" />
                        {user.name}
                        <svg className="ms-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                      <Dropdown.Link href={route('profile.edit')}>
                        <span className='flex justify-between'>
                          الملف الشخصي
                          <DarkMode />
                        </span>
                      </Dropdown.Link>
                      <Dropdown.Link href={route('logout')} method="post">تسجيل خروج</Dropdown.Link>
                    </Dropdown.Content>
                  </Dropdown>
                </div>
              </div>

              {/* Mobile Menu */}
              <div className="flex items-center gap-4 md:hidden px-2">
                <DarkMode />
                {showMenu ? <HiMenuAlt3 onClick={toggleMenu} className="text-2xl cursor-pointer" /> : <HiMenuAlt1 onClick={toggleMenu} className="text-2xl cursor-pointer" />}
              </div>
            </div>
          </div>
          <ResponsiveMenu showMenu={showMenu} Links={links} user={user} />
        </nav>

        {/* Main Content */}
        {header && (
          <header className="bg-white dark:bg-gray-800 shadow ">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">{header}</div>
          </header>
        )}
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
