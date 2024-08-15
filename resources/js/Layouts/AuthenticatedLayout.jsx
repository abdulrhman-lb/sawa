import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Pages/Navbar/NavLink';
import { Link } from '@inertiajs/react';
import DarkMode from '@/Pages/Navbar/DarkMode';
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import ResponsiveMenu from '@/Pages/Navbar/ResponsiveMenu';
import Footer from '@/Components/Footer';


export default function AuthenticatedLayout({ user, header, children }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  const links = [
    {
      'id': 1,
      'name': 'الرئيسية',
      'link': 'home',
      'kind': 1,
      'dropdown': 0,
      'down': []
    },
    {
      'id': 2,
      'name': 'القسم المالي',
      'link': 'task.index',
      'kind': 3,
      'dropdown': 1,
      'down': [
        {
          'id': 21,
          'name': 'الطلبات المنفذة',
          'link': 'dashboard.home',
        },
        {
          'id': 22,
          'name': 'الأرصدة الفعلية والأرباح للمنتجات',
          'link': 'category.index',
        },
        // {
        //   'id': 23,
        //   'name': 'تفاصيل الأرصدة الفعلية والأرباح للمنتجات',
        //   'link': 'dashboard.product',
        // },
        {
          'id': 24,
          'name': 'أرصدة المراكز',
          'link': 'dashboard.home',
        },
        // {
        //   'id': 25,
        //   'name': 'تفاصيل أرصدة المراكز',
        //   'link': 'dashboard.home',
        // },
        {
          'id': 25,
          'name': 'حركة رأس المال',
          'link': 'dashboard.home',
        },
        {
          'id': 26,
          'name': 'ضبط العمولة',
          'link': 'dashboard.home',
        },
      ]
    },
    {
      'id': 3,
      'name': 'الزبائن',
      'link': 'task.myTasks',
      'kind': 1,
      'dropdown': 0,
      'down': []
    },
    {
      'id': 4,
      'name': 'المستخدمين',
      'link': 'user.index',
      'kind': 2,
      'dropdown': 0,
      'down': []
    },
    {
      'id': 5,
      'name': 'لوحة التحكم',
      'link': 'dashboard.home',
      'kind': 3,
      'dropdown': 1,
      'down': [
        {
          'id': 51,
          'name': 'الرئيسية',
          'link': 'dashboard.home',
        },
        {
          'id': 52,
          'name': 'تصنيف المنتجات',
          'link': 'category.index',
        },
        {
          'id': 53,
          'name': 'المنتجات',
          'link': 'product.index',
        },
        {
          'id': 54,
          'name': 'أنواع بيانات الخدمات',
          'link': 'datakind.index',
        },
        {
          'id': 55,
          'name': 'الخدمات',
          'link': 'service.index',
        },
      ]
    },
  ]

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className={"bg-slate-100 dark:bg-gray-800 dark:text-white duration-300 shadow-xl border-b border-gray-100 dark:border-gray-700 w-full"}>
        <div className="container py-3 md:py-2">
          <div className="flex justify-between items-center">
            {/* logo section */}
            <div className="shrink-0 flex items-center px-3">
              <Link href="/">
                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
              </Link>
            </div>
            {/*Desptop NavLinks section */}
            <div className="hidden md:block">
              <ul className="flex items-center space-x-2 gap-10">
                {links.map((link) => (
                  (user.kind == 'admin' && link.kind <= 3) ? (
                    (link.dropdown === 0) ? (
                      <li key={link.id} className="cursor-pointer">
                        <NavLink href={route(link.link)} active={route().current(link.link)} className='ml-8 '>
                          {link.name}
                        </NavLink>
                      </li>
                    ) : (
                      <Dropdown>
                        <Dropdown.Trigger>
                          <li key={link.id} className="cursor-pointer">
                            <button id="dropdownNavbarLink" className=" inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700">
                              {link.name}
                              <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                              </svg>
                            </button>
                          </li>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                          {link.down.map((downLink) => (
                            <Dropdown.Link key={downLink.id} href={route(downLink.link)}>{downLink.name}</Dropdown.Link>
                          ))}
                        </Dropdown.Content>
                      </Dropdown>
                    )
                  ) : (user.kind == 'super_user' && link.kind <= 2) ? (
                    (link.dropdown === 0) ? (
                      <li key={link.id} className="cursor-pointer">
                        <NavLink href={route(link.link)} active={route().current(link.link)} className='ml-8 '>
                          {link.name}
                        </NavLink>
                      </li>
                    ) : (
                      <Dropdown>
                        <Dropdown.Trigger>
                        <li key={link.id} className="cursor-pointer">
                          <button id="dropdownNavbarLink" className="inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700">
                            {link.name}
                            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                          </button>
                          </li>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                          {link.down.map((downLink) => (
                            <Dropdown.Link key={downLink.id} href={route(downLink.link)}>{downLink.name}</Dropdown.Link>
                          ))}
                        </Dropdown.Content>
                      </Dropdown>
                    )
                  ) : (user.kind == 'user' && link.kind <= 1) ? (
                    (link.dropdown === 0) ? (
                      <li key={link.id} className="cursor-pointer">
                      <NavLink href={route(link.link)} active={route().current(link.link)} className='ml-8 '>
                        {link.name}
                      </NavLink>
                      </li>
                    ) : (
                      <Dropdown>
                        <Dropdown.Trigger>
                        <li key={link.id} className="cursor-pointer">
                          <button id="dropdownNavbarLink" className="inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700">
                            {link.name}
                            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                          </button>
                          </li>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                          {link.down.map((downLink) => (
                            <Dropdown.Link key={downLink.id} href={route(downLink.link)}>{downLink.name}</Dropdown.Link>
                          ))}
                        </Dropdown.Content>
                      </Dropdown>
                    )
                  ) : null
                ))}
                <DarkMode />
              </ul>
            </div>
            <div className="hidden sm:flex sm:items-center sm:ms-6 ">
              <div className="ms-3 relative">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                      >
                        {user.name}

                        <svg
                          className="ms-2 -me-0.5 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  </Dropdown.Trigger>

                  <Dropdown.Content>
                    <Dropdown.Link href={route('profile.edit')}>الملف الشخصي</Dropdown.Link>
                    <Dropdown.Link href={route('logout')} method="post" as="button">
                      تسجيل خروج
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            </div>
            {/*Mobile View */}
            <div className="flex items-center gap-4 md:hidden px-2">
              <DarkMode />              {
                showMenu ? (
                  <HiMenuAlt3
                    onClick={toggleMenu}
                    className="text-2xl cursor-pointer"
                  />
                ) : (
                  <HiMenuAlt1
                    onClick={toggleMenu}
                    className="text-2xl cursor-pointer"
                  />
                )
              }
            </div>
          </div>
        </div>
        {/* Mobile Menu Section */}
        <ResponsiveMenu showMenu={showMenu} Links={links} toggleMenu={toggleMenu} user={user}/>
      </nav>
      {/* <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 fixed w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='inline-flex fixed sm:left-14 md:left-4 top-5'>
          
        </div>
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <Link href="/">
                  <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                </Link>
              </div>

              <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex mb-8">
                {links.map((link) => (
                  (user.kind == 'admin' && link.kind <= 3) ? (
                    (link.dropdown === 0) ? (
                      <NavLink key={link.id} href={route(link.link)} active={route().current(link.link)} className='ml-8 '>
                        {link.name}
                      </NavLink>
                    ) : (
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button key={link.id} id="dropdownNavbarLink" className="mt-5 py-5 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700">
                            {link.name}
                            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                          </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                          {link.down.map((downLink) => (
                            <Dropdown.Link key={downLink.id} href={route(downLink.link)}>{downLink.name}</Dropdown.Link>
                          ))}
                        </Dropdown.Content>
                      </Dropdown>
                    )
                  ) : (user.kind == 'super_user' && link.kind <= 2) ? (
                    (link.dropdown === 0) ? (
                      <NavLink key={link.id} href={route(link.link)} active={route().current(link.link)} className='ml-8 '>
                        {link.name}
                      </NavLink>
                    ) : (
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button key={link.id} id="dropdownNavbarLink" className="mt-5 py-5 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700">
                            {link.name}
                            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                          </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                          {link.down.map((downLink) => (
                            <Dropdown.Link key={downLink.id} href={route(downLink.link)}>{downLink.name}</Dropdown.Link>
                          ))}
                        </Dropdown.Content>
                      </Dropdown>
                    )
                  ) : (user.kind == 'user' && link.kind <= 1) ? (
                    (link.dropdown === 0) ? (
                      <NavLink key={link.id} href={route(link.link)} active={route().current(link.link)} className='ml-8 '>
                        {link.name}
                      </NavLink>
                    ) : (
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button key={link.id} id="dropdownNavbarLink" className="mt-5 py-5 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700">
                            {link.name}
                            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                          </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                          {link.down.map((downLink) => (
                            <Dropdown.Link key={downLink.id} href={route(downLink.link)}>{downLink.name}</Dropdown.Link>
                          ))}
                        </Dropdown.Content>
                      </Dropdown>
                    )
                  ) : null
                ))}
              </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:ms-6">
              <div className="ms-3 relative">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                      >
                        {user.name}

                        <svg
                          className="ms-2 -me-0.5 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  </Dropdown.Trigger>

                  <Dropdown.Content>
                    <Dropdown.Link href={route('profile.edit')}>الملف الشخصي</Dropdown.Link>
                    <Dropdown.Link href={route('logout')} method="post" as="button">
                      تسجيل خروج
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            </div>


            <div className="-me-0 flex items-center sm:hidden">
              <button
                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          <DarkMode />
          </div>
        </div>

        <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
          <div className="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
              Dashboard
            </ResponsiveNavLink>
          </div>

          <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
            <div className="px-4">
              <div className="font-medium text-base text-gray-800 dark:text-gray-200">{user.name}</div>
              <div className="font-medium text-sm text-gray-500">{user.email}</div>
            </div>

            <div className="mt-3 space-y-1">
              <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
              <ResponsiveNavLink method="post" href={route('logout')} as="button">
                Log Out
              </ResponsiveNavLink>
            </div>
          </div>
        </div>
      </nav> */}

      {header && (
        <header className="bg-white dark:bg-gray-800 shadow ">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
        </header>
      )}

      <main>{children}</main>
      <Footer />
    </div>
  );
}
