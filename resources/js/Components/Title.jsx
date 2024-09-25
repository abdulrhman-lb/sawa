
export default function Title({ className = '', children }) {
  return (
    <h2
      className={`font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight text-nowrap ${className}`}>
      {children}
    </h2>
  );
}
