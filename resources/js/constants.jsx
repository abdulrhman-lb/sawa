export const STATUS_CLASS_MAP ={
  'inactive'    : 'min-w-[80px] inline-block bg-red-800 text-red-100 text-md font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300',
  'active'      : 'min-w-[80px] inline-block bg-green-800 text-green-100 text-md font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300',
} 

export const STATUS_TEXT_MAP ={
  'inactive'    : 'غير فعال',
  'active'      : 'فعال',
} 

export const KIND_CLASS_MAP ={
  'user'        : 'min-w-[110px] inline-block bg-yellow-700 text-yellow-100 text-md font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300 text-nowrap',
  'super_user'  : 'min-w-[110px] inline-block bg-blue-800 text-blue-100 text-md font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 text-nowrap',
  'admin'       : 'bg-green-500',
} 

export const KIND_TEXT_MAP ={
  'user'        : 'مركز بيع عادي',
  'super_user'  : 'حساب تاجر مميز',
  'admin'       : 'مدير نظام',
} 

export const KIND_DATA_TEXT_MAP ={
  'var'         : 'متغير',
  'const'       : 'ثابت',
} 

export const ORDER_CLASS_MAP ={
  'in_progress' : 'min-w-[90px] inline-block bg-yellow-600 text-yellow-100 text-md font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300',
  'completed'   : 'min-w-[90px] inline-block bg-green-800 text-green-100 text-md font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300',
  'reject'      : 'min-w-[90px] inline-block bg-red-800 text-red-100 text-md font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300',
} 

export const ORDER_TEXT_MAP ={
  'in_progress' : 'قيد المعالجة',
  'completed'   : 'مقبول',
  'reject'      : 'مرفوض',
}