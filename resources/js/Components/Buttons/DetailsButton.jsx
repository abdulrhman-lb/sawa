import { TbListDetails } from "react-icons/tb";
export default function DetailsButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-2 py-2 mx-1 bg-cyan-600 border border-transparent rounded-md text-sm text-white uppercase tracking-widest hover:bg-cyan-500/90 focus:bg-gray-800 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
            <TbListDetails style={{ marginRight: '8px' }} size={15} />
        </button>
    );
}
