import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import TextInput from "@/Components/TextInput";

export default function SearchableDropdown({ items, name, queryParams, selectedItem, onSelectItem, placeholder = "اختر عنصرًا" }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [selectedName, setSelectedName] = useState(selectedItem ? selectedItem.name : placeholder);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // تحديد العنصر المختار بناءً على queryParams
    const selectedItem = items.find(item => item.id == queryParams[name]);
    if (selectedItem) {
      setSelectedName(selectedItem.name);
    }
  }, [queryParams, items, name]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom,
      left: rect.left,
      width: rect.width > 200 ? rect.width : 200,
    });
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelectItem = (item) => {
    setSelectedName(item.name);
    onSelectItem(item);
    setDropdownOpen(false); // أغلق القائمة بعد اختيار العنصر
  };

  const dropdownMenu = (
    <div
      style={{ top: dropdownPosition.top, left: dropdownPosition.left, width: dropdownPosition.width }}
      className="absolute bg-white dark:bg-gray-900 border border-gray-300 rounded mt-1 z-50"
      onMouseDown={(e) => e.stopPropagation()} // منع إغلاق القائمة عند النقر داخلها
    >
      <TextInput
        className="w-full mb-2 p-2 border-b border-gray-300 text-sm"
        placeholder="ابحث..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onMouseDown={(e) => e.stopPropagation()} // منع إغلاق القائمة عند النقر داخل مربع البحث
      />
      <ul className="max-h-60 overflow-y-auto text-gray-900 dark:text-white text-sm">
        <li
          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
          onMouseDown={(e) => {
            e.stopPropagation();
            handleSelectItem({ id: 0, name: 'عرض الكل' });
          }}
        >
          عرض الكل
        </li>
        {filteredItems.map((item) => (
          <li
            key={item.id}
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleSelectItem(item);
            }}
          >
            {item.name}
          </li>
        ))}
        {filteredItems.length === 0 && (
          <li className="px-4 py-2 text-gray-500 dark:text-gray-400">لا توجد نتائج</li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full font-medium text-sm text-right p-2 flex border-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
      >
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
        {selectedName}
      </button>
      {dropdownOpen && ReactDOM.createPortal(dropdownMenu, document.body)}
    </div>
  );
}
