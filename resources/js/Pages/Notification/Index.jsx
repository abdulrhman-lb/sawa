
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import ScrollBar from "@/Components/ScrollBar";
import Title from "@/Components/Title";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ar'; // إذا كنت تريد دعم اللغة العربية
import { IoNotificationsCircleSharp } from "react-icons/io5";

dayjs.extend(relativeTime);
dayjs.locale('ar'); // لضبط اللغة على العربية إذا كنت ترغب

export default function index({ auth, message, initialNotifications, allNotifications }) {

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      notification={initialNotifications}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message} >
            <Title className="flex">
              <IoNotificationsCircleSharp className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              الإشعارات
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="الإشعارات" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-2 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <ul
                  role="menu"
                  className="min-w-[350px] flex flex-col gap-1 overflow-auto rounded-md border border-blue-50 bg-white font-sans text-sm font-normal text-blue-500 shadow-lg shadow-blue-500/10"
                >
                  {allNotifications.map((notification, index) => (
                    <div key={index}>
                      <Link href={`${(notification.data.url)}?notification_id=${notification.id}`}>
                        <button
                          role="menuitem"
                          onClick={() => { router.get(route(notification.data.url)) }}
                          className={`flex shadow w-full cursor-pointer select-none items-center gap-4 rounded-md px-3 py-2 text-start leading-tight transition-all hover:bg-blue-50 hover:text-gray-900 
                                    ${notification.read_at === null ? 'bg-blue-100' : null}
                                    `}
                                      >
                          <img
                            alt={notification.data.title}
                            src={notification.data.image}
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}