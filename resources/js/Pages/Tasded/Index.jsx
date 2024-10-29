import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ScrollBar from '@/Components/ScrollBar';
import Title from '@/Components/Title';
import { FaBorderNone } from 'react-icons/fa';
import CreateTasded from './Partials/CreateTasded';
import IndexTasdedUser from './Partials/IndexTasdedUser';

export default function index({ 
  auth, 
  tasdeds,
  message,
  success,
 }) {

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <FaBorderNone className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              استعلام تسديد
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="استعلام تسديد" />
      <div className="py-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-2 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <CreateTasded
              auth={auth}
              success={success}
              className="max-w-full"
            />
          </div>
          <div className="p-2 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <IndexTasdedUser
              tasdeds={tasdeds}
              className="max-w-full"
            />
          </div>
          {/* <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <UpdatePasswordForm className="max-w-xl" updated={updated} />
          </div> */}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
