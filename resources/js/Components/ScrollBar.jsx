import { useEffect, useRef, useState } from "react";

export default function ScrollBar({ message, children }) {
  const [duration, setDuration] = useState(20); // المدة الافتراضية
  const messageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const messageWidth = messageRef.current.offsetWidth;
    const containerWidth = containerRef.current.offsetWidth;

    // حساب مدة الحركة بناءً على طول الرسالة والحاوية
    if (messageWidth > containerWidth) {
      const newDuration = (messageWidth / containerWidth) * 15;
      setDuration(newDuration);
    } else {
      setDuration(0); // إذا كانت الرسالة قصيرة لا حاجة للحركة
    }
  }, [message]);

  return (
    <div className="w-full -mt-3">
      <div className={`bg-teal-50 border-t-2 ${message.messages === '-' ? 'border-teal-500' : 'border-red-500'} rounded-lg p-4 dark:bg-teal-800/30`} role="alert" aria-labelledby="hs-bordered-success-style-label">
        <div className="flex-initial flex">
          <div className="shrink-0">
            <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </span>
          </div>
          <div className="ms-3 w-[95%]">
            <div className="text-sm text-gray-700 dark:text-neutral-400">
              <div
                ref={containerRef}
                className="marquee-container rounded-md py-1 "
              >
                <div
                  ref={messageRef}
                  className="marquee text-2xl text-gray-900 dark:text-gray-300 font-semibold "
                  style={{
                    animationDuration: `${duration}s`, // تطبيق مدة الحركة
                  }}
                >
                  <span className="text-red-600 font-semibold">رسالة الإدارة: </span>
                  {message.messages === "-" ? (
                    `أهلا وسهلا بكم في مركز سوا لخدمات الانترنت والاتصالات في حال وجود أي استفسار يرجى الضغط على زر الدعم الفني أو الاتصال بالرقم : 0${message.support_number}`
                  ) : (
                    message.messages
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-gray-800 text-xl font-semibold dark:text-white px-2 mt-1 flex justify-between">
            {children}
          </div>
        </div>
      </div>

    </div>

  );
}
