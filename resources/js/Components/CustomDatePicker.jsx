import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CustomDatePicker({ className = '', isFocused = false, ...props }) {

    return (
        <DatePicker

            dateFormat="dd/MM/yyyy"
            className={'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ' + className}
            {...props}
        />
    );
}
