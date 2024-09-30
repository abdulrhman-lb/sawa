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
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Menu } from '@headlessui/react';
import Notifications from '@/Components/Notifications';

export default function AuthenticatedLayout({ user, header, children, message, notification }) {
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
      id: 2, name: 'القسم المالي', link: 'task.index', kind: 0, dropdown: true, down: [
        { id: 22, name: 'حسابي', link: `center.balance.index.user`, requiredRole: ['super_user', 'user'] },
        { id: 22, name: 'إضافة رصيد المنتجات', link: 'product.balances.home', requiredRole: ['admin'] },
        { id: 23, name: 'حسابات المراكز', link: 'center.balances.home', requiredRole: ['admin', 'super_user'] },
        { id: 25, name: 'نفقات ومصاريف', link: 'box.index', requiredRole: ['admin'] },
        { id: 26, name: 'حركة الصندوق اليومية', link: 'box.home', requiredRole: ['admin'] },
        { id: 27, name: 'إجمالي البيان المالي', link: 'capital.index', requiredRole: ['admin'] },
        { id: 28, name: 'أسعار تفاصيل الخدمات', link: 'amountkind.index', requiredRole: ['admin'] },
      ]
    },
    { id: 3, name: 'الزبائن', link: 'customer.index', kind: 1, dropdown: false, down: [] },
    {
      id: 4, name: 'مراكز التوزيع', link: 'user.index', kind: 2, dropdown: true, down: [
        { id: 41, name: 'إضافة مركز جديد', link: 'user.index', requiredRole: ['admin', 'super_user'] },
        // { id: 42, name: 'السماحيات', link: 'category-permission.index', requiredRole: ['admin', 'super_user'] },
        { id: 43, name: ' نسبة العمولة', link: 'comission-new.index', requiredRole: ['admin', 'super_user'] },
      ]
    },
    {
      id: 5, name: 'لوحة التحكم', link: 'dashboard.home', kind: 3, dropdown: true, down: [
        { id: 51, name: 'التصنيفات', link: 'category.index', requiredRole: ['admin', 'super_user'] },
        { id: 53, name: 'المنتجات', link: 'product.index', requiredRole: ['admin', 'super_user'] },
        { id: 54, name: 'أنواع بيانات الخدمات', link: 'datakind.index', requiredRole: ['admin', 'super_user'] },
        { id: 55, name: 'الخدمات', link: 'service.index', requiredRole: ['admin', 'super_user'] },
        { id: 56, name: 'تفاصيل الخدمات', link: 'kind.index', requiredRole: ['admin'] },
        { id: 59, name: 'إعدادات', link: 'settings.edit', requiredRole: ['admin'] },
      ]
    },
    // { id: 6, name: 'حسابي', link: `center-balance.index`, kind: 1, dropdown: false, down: [] },

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
                'inline-flex items-center justify-center w-[50%] lg:w-[130px] px-2 pt-3 pb-3 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none  ' +
                (isDropdownActive ? 'bg-red-600/80 text-white' : 'bg-blue-700/80 text-white hover:bg-blue-800 focus:border-gray-300') +
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
                <Dropdown.Link 
                key={downLink.id}
                href={
                  downLink.link === 'center-balance.index' 
                    ? route(downLink.link, { center_id: user.id })  // تمرير معرف المستخدم في الرابط
                    : route(downLink.link)
                }
                 isActive={route().current(downLink.link)}>
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
      <div className="min-h-screen dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 sm:px-4 lg:px-1">
          <div className="flex h-14 items-center justify-between gap-1">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-center mx-4 block fill-current">
                  <img src={message.image} className='rounded-full mx-auto w-[50px] h-[50px] lg:w-[50px] lg:h-[50px]' alt="" />
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-1">
                  <ul className="flex items-center space-x-1 gap-1 text-nowrap justify-between mx-auto">
                    {renderLinks(links)}
                  </ul>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="flex items-center space-x-1 gap-3">
                  <a
                    className="flex px-2 pb-3 pt-3 text-xs bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font"
                    href={`https://api.whatsapp.com/send/?phone=963${message.support_number}&text&type=phone_number&app_absent=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    الدعم الفني
                    <FaWhatsapp className='my-auto mr-1' />
                  </a>
                  {(user.kind != 'admin') ? (
                    <div className={`flex h-11 text-lg font-semibold rounded-md border-2 px-1  ${user.user_balance > 0 ? ' text-blue-600 border-blue-600' : (userBalance > 0 ? 'text-emerald-600 border-emerald-600' : 'text-red-600 border-red-600')}`}>
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
                          <IoMdAddCircle className='my-auto text-xl text-emerald-600' />
                        </button>
                      )}

                    </div>
                  ) : (
                    null
                  )}
                </div>

                <Notifications initialNotifications={notification} userId={user.id} />

                {/* Profile dropdown */}
                <div className="hidden sm:flex sm:items-center">
                  <Dropdown>
                    <Dropdown.Trigger>
                      <button className="inline-flex items-center py-1 text-sm font-medium rounded-md text-gray-900 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                        <img src={image} className='rounded-full w-[40px] h-[40px] border-2 border-gray-300' alt="" />
                        <p className='text-nowrap mx-1'>
                        {user.name}
                        </p>
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
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <div className="ml-1 flex items-center">
                <div className="flex items-center space-x-1 gap-2">
                  <a
                    className="flex px-1 pb-3 pt-3 text-sm rounded-md text-white font"
                    href={`https://api.whatsapp.com/send/?phone=963${message.support_number}&text&type=phone_number&app_absent=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className='m-1 text-emerald-600 text-3xl font-semibold' />
                  </a>
                  {(user.kind != 'admin') ? (
                    <div className={`flex h-12 text-sm font-semibold rounded-md border-2 px-1  ${user.user_balance > 0 ? ' text-blue-600 border-blue-600' : (userBalance > 0 ? 'text-emerald-600 border-emerald-600' : 'text-red-600 border-red-600')}`}>
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
                <button
                  type="button"
                  className="relative rounded-full mx-2 text-gray-800 p-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-7 w-7" />
                </button>
                {showMenu ? <HiMenuAlt3 onClick={toggleMenu} className="text-2xl cursor-pointer text-gray-800 dark:text-gray-300" /> : <HiMenuAlt1 onClick={toggleMenu} className="text-2xl cursor-pointer text-gray-800 dark:text-gray-300" />}
              </div>
            </div>
          </div>
          {showMenu && (
            <div className="lg:hidden bg-blue-600/20 rounded-md py-1 mb-2">
              <div className="flex lg:hidden m-2 justify-end mx-4">
                <Dropdown>
                  <Dropdown.Trigger>
                    <div className='flex gap-10'>
                      <button className="inline-flex items-center px-1 py-1 text-md font-medium rounded-md text-gray-900 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                        <img src={image} className='rounded-full w-[40px] h-[40px] ml-2 border-2 border-gray-300' alt="" />
                        <span className='text-gray-800 dark:text-gray-300'>{user.name}</span>
                        <svg className="ms-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className='flex mt-2 text-left justify-end'>
                        <DarkMode />
                      </div>
                    </div>
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
              <ul className="space-y-1 m-2">
                {renderLinks(links)}
              </ul>
            </div>
          )}
        </div>
        {header && (
          <header className=" ">
            <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-4 lg:px-8">{header}</div>
          </header>
        )}
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
