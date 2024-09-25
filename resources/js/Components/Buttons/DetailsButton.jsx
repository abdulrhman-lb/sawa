import { TbListDetails } from "react-icons/tb";
export default function DetailsButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-2 py-2 mx-1 bg-cyan-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-cyan-800 active:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
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
