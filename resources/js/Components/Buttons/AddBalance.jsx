import React, { useState, useEffect } from 'react';

export default function AddBalance({ className = '', disabled, children, ...props }) {
    // الحالة لتخزين اللون الحالي
    const [buttonColor, setButtonColor] = useState('bg-emerald-600');

    useEffect(() => {
        // دالة لتبديل اللون
        const toggleColor = () => {
            setButtonColor(prevColor => 
                prevColor === 'bg-blue-600' ? 'bg-red-600' : 'bg-blue-600'
            );
        };

        // إنشاء مؤقت لتبديل اللون كل ثانية
        const interval = setInterval(toggleColor, 500);

        // تنظيف المؤقت عند إلغاء التثبيت
        return () => clearInterval(interval);
    }, []);

    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-2 py-2 mx-1 ${buttonColor} border border-transparent rounded-md font-semibold text-lg text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
