import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-block w-[100px] items-center text-center px-2 pt-4 pb-4 text-xl font-medium leading-5 transition duration-150 ease-in-out focus:outline-none rounded-md decoration-150 ' +
                (active
                    ? 'bg-red-600 text-white '
                    : 'bg-blue-700 text-white hover:bg-blue-800 focus:text-gray-700 ') +
                className
            }
        >
            {children}
        </Link>
    );
}
