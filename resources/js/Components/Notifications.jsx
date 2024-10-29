import { BellIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ar'; // دعم اللغة العربية
import { Link, router } from '@inertiajs/react';
import { debounce } from 'lodash'; // لتقليل عدد التحديثات المتتالية

dayjs.extend(relativeTime);
dayjs.locale('ar'); // لضبط اللغة على العربية

const Notifications = () => {
  const [notifications, setNotifications] = useState(null); // دعم حالة null أثناء التحميل
  const [count, setCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [pageLoaded, setPageLoaded] = useState(false); 
  const menuRef = useRef(); // مرجع للتحكم في القائمة

  // وظيفة التحكم في القائمة
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // إغلاق القائمة عند النقر خارجها
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // متابعة تحميل الصفحة باستخدام Inertia
  useEffect(() => {
    const finishLoading = () => setPageLoaded(true);

    window.addEventListener('inertia:finish', finishLoading);
    setPageLoaded(true); // الصفحة تعتبر جاهزة في أول تحميل

    return () => {
      window.removeEventListener('inertia:finish', finishLoading);
    };
  }, []);

  // تحسين الاتصال بـ SSE مع إيقافه عند التنقل بين التبويبات
  useEffect(() => {
    let source;

    const connectSSE = () => {
      source = new EventSource("/sse-updates");
      source.onmessage = (event) => {
        const acData = JSON.parse(event.data);
        updateNotifications(acData);
      };
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        connectSSE(); // إعادة الاتصال عند عودة المستخدم
      } else if (source) {
        source.close(); // إغلاق الاتصال عند ترك التبويبة
      }
    };

    if (pageLoaded) {
      connectSSE(); 
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (source) source.close();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pageLoaded]);

  // استخدام debounce لتقليل عدد التحديثات
  const updateNotifications = debounce((data) => {
    setNotifications(data['data']);
    setCount(data['count']);
  }, 300);

  return (
    <div className="relative mx-0 -mr-2" ref={menuRef}>
      <button
        type="button"
        className="relative rounded-full flex items-center justify-center p-3 font-sans text-xs font-bold uppercase text-pink-500 disabled:pointer-events-none disabled:opacity-50"
        onClick={toggleMenu}
      >
        <span className="sr-only">View notifications</span>
        <BellIcon aria-hidden="true" className="h-7 w-7" />
        {notifications && notifications.length > 0 && (
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 hover:bg-white hover:text-red-500 border-2 border-white rounded-full -top-0 -end-0 dark:border-gray-900">
            {notifications.length}
          </div>
        )}
      </button>

      {isMenuOpen && (
        <ul
          role="menu"
          className="absolute z-10 top-15 -right-80 min-w-[350px] flex flex-col gap-1 overflow-auto rounded-md border border-blue-50 bg-white font-sans text-sm font-normal text-blue-500 shadow-lg shadow-blue-500/10"
        >
          {notifications ? (
            notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification, index) => (
                <Link key={index} href={`${notification.data.url}?notification_id=${notification.id}`}>
                  <button
                    role="menuitem"
                    className={`flex shadow w-full cursor-pointer select-none items-center gap-4 rounded-md px-3 py-2 text-start leading-tight transition-all hover:bg-blue-50 hover:text-gray-900 ${
                      notification.read_at === null ? 'bg-blue-100' : ''
                    }`}
                  >
                    <img
                      alt={notification.data.title}
                      src={
                        notification.data.kind === 'tasdedCreated'
                          ? '/images/tasded/tasded.jpg'
                          : notification.data.image || '/images/profiles/noimage.jpg'
                      }
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
              ))
            ) : (
              <div className="p-4 text-center">لا يوجد إشعارات جديدة</div>
            )
          ) : (
            <div className="p-4 text-center">جارٍ تحميل الإشعارات...</div>
          )}
          <div className="flex justify-center rounded-md py-2 bg-emerald-700/20 border-2 border-emerald-700/40">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => router.get(route("notification.all"))}
            >
              <h2 className="font-semibold text-md">عرض جميع الإشعارات</h2>
            </button>
          </div>
        </ul>
      )}
    </div>
  );
};

export default Notifications;
