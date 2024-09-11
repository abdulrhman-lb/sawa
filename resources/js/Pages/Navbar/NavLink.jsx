import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-block w-[100px] items-center text-center px-2 pt-2 pb-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none rounded-md decoration-150 ' +
                (active
                    ? 'bg-blue-700 text-white '
                    : 'bg-blue-700/50 text-white hover:text-gray-700 dark:hover:text-gray-300  focus:text-gray-700 dark:focus:text-gray-300 ') +
                className
            }
        >
            {children}
        </Link>
    );
}
