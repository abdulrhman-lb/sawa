import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ScrollBar from '@/Components/ScrollBar';
import UpdateMessageForm from './Partials/UpdateMessageForm';
import UpdateImageForm from './Partials/UpdateImageForm';
import SuccessMessage from '@/Components/SuccessMessage';
import UpdateSupportNumberForm from './Partials/UpdateSupportNumberForm';
import Title from '@/Components/Title';

export default function Edit({ auth, success, message }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <Title>إعدادات</Title>
          <ScrollBar message={message} />
        </div>
      }
    >
      <Head title="إعدادات" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6 ">
          {success && (<SuccessMessage message={success} />)}
          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg text-center">
              <UpdateMessageForm
                message={message}
                success={success}
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
