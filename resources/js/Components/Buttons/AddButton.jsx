import { MdOutlineAddCircleOutline } from "react-icons/md";

export default function AddButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
              `inline-flex items-center px-2 py-2 mx-1 bg-emerald-600 border border-transparent rounded-md font-semibold text-lg text-white uppercase tracking-widest hover:bg-emerald-800 active:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
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
