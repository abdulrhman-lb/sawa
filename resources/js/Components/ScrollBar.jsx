export default function ScrollBar({ message }) {
  return (
    <div className="relative flex-grow mx-4 overflow-hidden border-4 border-red-600 rounded-md py-1">
      <div className="animate-slide text-3xl text-gray-900 dark:text-gray-300 whitespace-nowrap font-semibold">
        <span className="text-red-600 font-semibold">رسالة الإدارة: </span>
        {message.messages === '-' ? (
          `أهلا وسهلا بكم في مركز سوا لخدمات الانترنت والاتصالات في حال وجود أي استفسار يرجى الضغط على زر الدعم الفني أو الاتصال بالرقم : 0${message.support_number}`
        ) : (
          message.messages
        )}
      </div>
    </div>
  );
}
