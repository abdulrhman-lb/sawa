import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import ScrollBar from '@/Components/ScrollBar';
import Title from '@/Components/Title';
import { FaBorderNone } from 'react-icons/fa';

export default function Edit({ 
  auth, 
  mustVerifyEmail, 
  success, updated, 
  message, 
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
              الملف الشخصي
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="الملف الشخصي" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-2 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              success={success}
              className="max-w-full"
            />
          </div>
          <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <UpdatePasswordForm className="max-w-xl" updated={updated} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
