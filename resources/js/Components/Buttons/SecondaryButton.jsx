import { LuFilter } from "react-icons/lu";

export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
  return (
    <>
      <button
        {...props}
        type={type}
        className={
          `inline-flex items-center px-2 py-2 mx-1 bg-gray-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-800 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150 } ` + className
        }
        disabled={disabled}
      >
        {children}
        <LuFilter style={{ marginRight: '8px' }} size={15} />
      </button>
    </>

  );
}
