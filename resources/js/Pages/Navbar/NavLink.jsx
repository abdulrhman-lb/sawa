import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-block w-[50%] lg:w-[115px] items-center text-center px-2 text-xl font-medium leading-5 transition duration-150 ease-in-out focus:outline-none decoration-150 ' +
                (active
                    ? 'text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-lg px-2 py-2.5 text-center me-2 '
                    : 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:outline-none dark:focus:ring-cyan-800 font-medium rounded-lg text-lg px-2 py-2.5 text-center me-2 ') +
                className
            }
        >
            {children}
        </Link>
    );
}
