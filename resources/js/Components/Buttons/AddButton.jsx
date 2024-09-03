import { MdOutlineAddCircleOutline } from "react-icons/md";

export default function AddButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 mx-2 font-semibold bg-emerald-600 border border-transparent rounded-md text-sm text-white uppercase tracking-widest hover:bg-emerald-500/90 dark:hover:bg-token2/80 focus:bg-gray-800 dark:focus:bg-gray-500 active:bg-gray-900 dark:active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
            <MdOutlineAddCircleOutline   style={{ marginRight: '8px' }} size={15} />
        </button>
    );
}
