import React, { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Pages/Navbar/NavLink';
import { Link, usePage } from '@inertiajs/react';
import DarkMode from '@/Pages/Navbar/DarkMode';
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import ResponsiveMenu from '@/Pages/Navbar/ResponsiveMenu';
import Footer from '@/Components/Footer';
import AOS from "aos";
import "aos/dist/aos.css";
import { FaWhatsapp } from "react-icons/fa";


export default function AuthenticatedLayout({ user, header, children }) {
  const { props } = usePage();
  const userBalance = props.user_balance;
  const [showMenu, setShowMenu] = useState(false);

  const links = [
    { id: 1, name: 'الرئيسية', link: 'category.home', kind: 1, dropdown: false, down: [] },
    { id: 6, name: 'الطلبات', link: 'order.index', kind: 1, dropdown: false, down: [] },
    {
      id: 2, name: 'القسم المالي', link: 'task.index', kind: 1, dropdown: true, down: [
        { id: 21, name: 'الطلبات الكلية', link: 'order.home' },
        { id: 22, name: 'الأرصدة الفعلية والأرباح للمنتجات', link: 'product.balances.home' },
        { id: 23, name: 'الأرصدة الفعلية والأرباح للمراكز', link: 'center.balances.home' },
        { id: 24, name: 'أرصدة المراكز', link: 'center.balances.virtual.home' },
        { id: 25, name: 'نفقات ومصاريف', link: 'box.index' },
        { id: 26, name: 'حركة الصندوق اليومية', link: 'box.home' },
      ]
    },
    { id: 3, name: 'الزبائن', link: 'customer.index', kind: 1, dropdown: false, down: [] },
    { id: 4, name: 'المستخدمين', link: 'user.index', kind: 2, dropdown: false, down: [] },
    {
      id: 5, name: 'لوحة التحكم', link: 'dashboard.home', kind: 1, dropdown: true, down: [
        { id: 52, name: 'التصنيفات', link: 'category.index' },
        { id: 53, name: 'المنتجات', link: 'product.index' },
        { id: 54, name: 'أنواع بيانات الخدمات', link: 'datakind.index' },
        { id: 55, name: 'الخدمات', link: 'service.index' },
        { id: 56, name: 'تفاصيل الخدمات', link: 'kind.index' },
        { id: 57, name: 'أسعار تفاصيل الخدمات', link: 'amountkind.index' },
        { id: 58, name: 'تحديد نسبة العمولة', link: 'comission.index' },
      ]
    },
  ];

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    AOS.init({ duration: 800, offset: 100, delay: 100 });
    AOS.refresh();
  }, []);

  const renderLinks = (links) => {
    return links.map(link => {
      const isAdmin = user.kind === 'admin' && link.kind <= 3;
      const isSuperUser = user.kind === 'super_user' && link.kind <= 2;
      const isUser = user.kind === 'user' && link.kind <= 1;

      if (!isAdmin && !isSuperUser && !isUser) return null;

      if (!link.dropdown) {
        return (
          <li key={link.id} className="cursor-pointer">
            <NavLink href={route(link.link)} active={route().current(link.link)} className='ml-8 text-gray-900'>
              {link.name}
            </NavLink>
          </li>
        );
      }

      return (
        <Dropdown key={link.id}>
          <Dropdown.Trigger>
            <li className="cursor-pointer ml-6">
              <button className="inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-900 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700">
                {link.name}
                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
            </li>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {link.down.map(downLink => (
              <Dropdown.Link key={downLink.id} href={route(downLink.link)}>{downLink.name}</Dropdown.Link>
            ))}
          </Dropdown.Content>
        </Dropdown>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-slate-100 dark:bg-gray-800 dark:text-white duration-300 shadow-xl border-b border-gray-100 dark:border-gray-700 w-full">
        <div className="container py-3 md:py-2">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="shrink-0 flex items-center px-3">
              <Link href="/">
                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
              </Link>
            </div>
            {/* Desktop NavLinks */}
            <div className="hidden md:block">
              <ul className="flex items-center space-x-2 gap-1 text-nowrap">
                {renderLinks(links)}
                <div className="flex items-center space-x-2 gap-1">
                  <a className="flex px-2 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 rounded-md text-white " href="https://api.whatsapp.com/send/?phone=963947450645&text&type=phone_number&app_absent=0">
                    الدعم الفني
                    <FaWhatsapp className='m-1' />
                  </a>
                  <span className="block px-1 py-2 text-sm text-gray-700 dark:text-gray-300">الرصيد: {userBalance}</span>
                  <DarkMode />
                </div>
                {/* User Dropdown */}
                <div className="hidden sm:flex sm:items-center sm:ms-6">
                  <Dropdown>
                    <Dropdown.Trigger>
                      <button className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-gray-900 dark:text-gray-400 bg-slate-100 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                        {user.name}
                        <svg className="ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                      <Dropdown.Link href={route('profile.edit')}>الملف الشخصي</Dropdown.Link>
                      <Dropdown.Link href={route('logout')} method="post" as="button">تسجيل خروج</Dropdown.Link>
                    </Dropdown.Content>
                  </Dropdown>
                </div>
              </ul>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
