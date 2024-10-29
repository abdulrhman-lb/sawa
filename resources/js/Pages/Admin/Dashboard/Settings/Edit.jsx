import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ScrollBar from '@/Components/ScrollBar';
import UpdateMessageForm from './Partials/UpdateMessageForm';
import UpdateImageForm from './Partials/UpdateImageForm';
import SuccessMessage from '@/Components/SuccessMessage';
import UpdateSupportNumberForm from './Partials/UpdateSupportNumberForm';
import Title from '@/Components/Title';
import { IoSettingsOutline } from "react-icons/io5";
import UpdateTasdedForm from './Partials/UpdateTasdedForm';
import UpdateAppStatusForm from './Partials/UpdateAppStatusForm';

export default function Edit({ auth, success, message }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <IoSettingsOutline className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              إعدادات
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="إعدادات" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6 ">
          {success && (<SuccessMessage message={success} />)}
          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-center'>
            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg text-center">
              <UpdateMessageForm
                message={message}
                success={success}
                auth={auth}
                className="max-w-full"
              />
            </div>
            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg text-center">
              <UpdateSupportNumberForm
                message={message}
                success={success}
                className="max-w-full"
              />
            </div>
            <div className={`p-4 sm:p-8 ${message.tasded === 1 ? 'bg-green-300' : 'bg-red-300'} shadow sm:rounded-lg text-center`}>
              <UpdateTasdedForm
                message={message}
                success={success}
                className="max-w-full"
              />
            </div>
            <div className={`p-4 sm:p-8 ${message.app_status === 1 ? 'bg-green-300' : 'bg-red-300'} shadow sm:rounded-lg text-center`}>
              <UpdateAppStatusForm
                message={message}
                success={success}
                className="max-w-full"
              />
            </div>
            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg text-center">
              <UpdateImageForm
                message={message}
                success={success}
                className="max-w-full"
              />
            </div>

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
