import { GiMoneyStack } from "react-icons/gi";

export default function CashButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
              `inline-flex items-center px-2 py-1 mx-1 bg-emerald-700 border border-transparent rounded-md text-sm text-white tracking-widest hover:bg-emerald-800 active:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        > 
            {children}
            <GiMoneyStack style={{ marginRight: '8px' }} size={25} />
        </button>
    );
}
