import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import NavLink from "./NavLink";
import Dropdown from "@/Components/Dropdown";

const ResponsiveMenu = ({ showMenu, Links, toggleMenu, user }) => {

  return (
    <>
      <div className={`${showMenu ? ("right-0") : ("right-[-100%]")} 
      fixed bottom-0 top-0 w-[65%] 
      transition-all duration-300 shadow-md pt-8 px-2
      bg-white dark:bg-gray-900 z-50 flex flex-col justify-between pb-4`}>
        <div className="">
          {/* User Section */}
          <div className="flex justify-start items-center gap-2 ">
            <div className="bg-white px-1 py-2 rounded-xl shadow-md ">
              <Link href="/">
                <ApplicationLogo className="block h-9 w-full fill-current text-gray-800 dark:text-gray-200" />
              </Link>
            </div>
          </div>
          {/* Menu Section */}
          <nav className="mt-8 px-6">
            <ul className="space-y-2 text-xl">
              {Links.map((link) => (
                (user.kind == 'admin' && link.kind <= 3) ? (
                  (link.dropdown === 0) ? (
                    <li key={link.id} className="cursor-pointer py-2">
                      <NavLink href={route(link.link)} active={route().current(link.link)} className='ml-8 '>
                        {link.name}
                      </NavLink>
                    </li>
                  ) : (
                    <li key={link.id} className="cursor-pointer py-2">
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button id="dropdownNavbarLink" className=" inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700">
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
                    </li>
                  )
                ) : (user.kind == 'super_user' && link.kind <= 2) ? (
                  (link.dropdown === 0) ? (
                    <li key={link.id} className="cursor-pointer py-2">
                      <NavLink href={route(link.link)} active={route().current(link.link)} className='ml-8 '>
                        {link.name}
                      </NavLink>
                    </li>
                  ) : (
                    <li key={link.id} className="cursor-pointer py-2">
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button id="dropdownNavbarLink" className="mt-5 py-5 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700">
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
                    </li>
                  )
                ) : (user.kind == 'user' && link.kind <= 1) ? (
                  (link.dropdown === 0) ? (
                    <li key={link.id} className="cursor-pointer py-2">
                      <NavLink href={route(link.link)} active={route().current(link.link)} className='ml-8 '>
                        {link.name}
                      </NavLink>
                    </li>
                  ) : (
                    <li key={link.id} className="cursor-pointer py-2">
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button id="dropdownNavbarLink" className="mt-5 py-5 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700">
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
                    </li>
                  )
                ) : null
              ))}
            </ul>
          </nav>
        </div>
        {/* Footer Section */}
        <div>
          <h1>
            Made By{" "}
            <a href="http://www.token.sy">Token</a>
            {" "}
          </h1>
        </div>
      </div>
    </>
  )
}

export default ResponsiveMenu