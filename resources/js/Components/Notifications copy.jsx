import { BellIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ar'; // إذا كنت تريد دعم اللغة العربية
import { Link, router } from '@inertiajs/react';

dayjs.extend(relativeTime);
dayjs.locale('ar'); // لضبط اللغة على العربية إذا كنت ترغب

const Notifications = () => {
  const [notifications, setNotifications] = useState();
  const [count, setCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // حالة التحكم في القائمة
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [pageLoaded, setPageLoaded] = useState(false); // حالة لمتابعة تحميل الصفحة

  useEffect(() => {
    // عندما ينتهي Inertia من تحميل الصفحة الجديدة
    const finishLoading = () => {
      setPageLoaded(true);
    };

    // إضافة event listeners لـ Inertia عند انتهاء تحميل الصفحة
    window.addEventListener('inertia:finish', finishLoading);

    // تأكيد أن الصفحة تعتبر جاهزة في البداية عند أول تحميل
    setPageLoaded(true);

    return () => {
      // إزالة event listeners عند إلغاء التفعيل
      window.removeEventListener('inertia:finish', finishLoading);
    };
  }, []);

  useEffect(() => {
    if (pageLoaded) { // جلب البيانات فقط إذا كانت الصفحة جاهزة
      var source = new EventSource("/sse-updates");
      source.onmessage = function (event) {
        let acData = JSON.parse(event.data);
        setNotifications(acData['data']); // تحديث الإشعارات
        setCount(acData['count']); // تحديث عدد الإشعارات
      };

      return () => {
        source.close(); // إغلاق الاتصال عند إلغاء التفعيل
      };
    }
  }, [pageLoaded]);

  return (
    <div className="relative mx-0 -mr-2">
      <button
        type="button"
        className="relative rounded-full flex items-center justify-center p-3 font-sans text-xs font-bold uppercase text-pink-500 disabled:pointer-events-none disabled:opacity-50"
        onClick={toggleMenu} // تفعيل تغيير الحالة عند الضغط على الزر
      >
        <span className="sr-only">View notifications</span>
        <BellIcon aria-hidden="true" className="h-7 w-7" />
        {count != 0 &&
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 hover:bg-white hover:text-red-500 border-2 border-white rounded-full -top-0 -end-0 dark:border-gray-900">
            {notifications.length}
          </div>}
      </button>

      {/* إظهار القائمة إذا كانت الحالة isMenuOpen true */}
      {isMenuOpen && (
        <ul
          role="menu"
          className="absolute z-10 top-15 -right-80 min-w-[350px] flex flex-col gap-1 overflow-auto rounded-md border border-blue-50 bg-white font-sans text-sm font-normal text-blue-500 shadow-lg shadow-blue-500/10"
        >
          {count != 0 ? (
            <>
              {notifications.slice(0, 5).map((notification, index) => (
                <div key={index}>
                  <Link href={`${(notification.data.url)}?notification_id=${notification.id}`}>
                    <button
                      role="menuitem"
                      className={`flex shadow w-full cursor-pointer select-none items-center gap-4 rounded-md px-3 py-2 text-start leading-tight transition-all hover:bg-blue-50 hover:text-gray-900 
                      ${notification.read_at === null ? 'bg-blue-100' : null}
                      `}
                    >
                      <img
                        alt={notification.data.title}
                        src={notification.data.kind === 'tasdedCreated'  ? '/images/tasded/tasded.jpg' :(notification.data.image ? notification.data.image : '/images/profiles/noimage.jpg')}
                        className="relative inline-block h-12 w-12 rounded-full object-cover border-2"
                      />

                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-gray-700">
                          {notification.data.title}
                        </p>
                        <p className="text-sm font-normal text-gray-700">
                          {notification.data.details}
                        </p>
                        <p className="flex items-center gap-1 text-xs font-light text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            className="h-3 w-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {dayjs(notification.created_at).fromNow()}
                        </p>
                      </div>
                    </button>
                  </Link>
                </div>
              ))}
            </>
          ) : (
            <button
              role="menuitem"
              className="flex w-full cursor-pointer select-none justify-center items-center gap-4 rounded-md px-3 py-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:text-blue-gray-900"
            >
              <div className="flex flex-col gap-1   ">
                <p className="text-sm font-normal text-gray-700 text-center">لا يوجد إشعارات جديدة</p>
              </div>
            </button>
          )}
          <div className="flex justify-center rounded-md py-2 bg-emerald-700/20 border-2 border-emerald-700/40">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => { router.get(route("notification.all")) }}
            >
              <h2 className='font-semibold text-md '>
                عرض جميع الإشعارات
              </h2>
            </button>
          </div>
        </ul>
      )}
    </div>
  );
};

export default Notifications;
