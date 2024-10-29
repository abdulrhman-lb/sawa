import SuccessMessage from "@/Components/SuccessMessage";

export default function Guest({ children, message }) {
  return (
<div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-200 to-blue-300 dark:bg-gray-900">
<div>
{message.app_status === 0 && (<SuccessMessage message={'التطبيق متوقف حاليا بسبب الصيانة الرجاء إعادة المحاولة لاحقا'}/>)}
  <div className="w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] min-w-[370px] min-h-[370px] px-6 py-4 bg-emerald-700/50 dark:bg-gray-800 shadow-md overflow-hidden rounded-full border-4 border-emerald-800/50">
    {children}
  </div>
  </div>
</div>

  );
}
