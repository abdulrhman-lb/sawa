import { useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FaRegSave } from 'react-icons/fa';

export default function UpdatePasswordForm({ className = '', updated }) {

  const passwordInput = useRef();
  const currentPasswordInput = useRef();
  const { data, setData, errors, post, reset, processing, recentlySuccessful } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
    _method: 'PUT'
  });

  const updatePassword = (e) => {
    e.preventDefault();

    post(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current.focus();
        }
      },
    });
  };

  return (
    <section className={className}>
      {updated && (<div className="bg-emerald-500 py-2 px-4 mr-0 text-white rounded mb-4">
        {updated}
      </div>)}
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">تحديث كلمة المرور</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          تأكد من أن حسابك يستخدم كلمة مرور طويلة وعشوائية ليظل آمنًا..
        </p>
      </header>
      <form onSubmit={updatePassword} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="current_password" value="كلمة المرور الحالية" />
          <TextInput
            id="current_password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) => setData('current_password', e.target.value)}
            type="password"
            className="mt-1 block w-full"
            autoComplete="current-password"
          />
          <InputError message={errors.current_password} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="password" value="كلمة المرور الجديدة" />
          <TextInput
            id="password"
            ref={passwordInput}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            type="password"
            className="mt-1 block w-full"
            autoComplete="new-password"
          />
          <InputError message={errors.password} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="password_confirmation" value="تأكيد كلمة المرور" />
          <TextInput
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            type="password"
            className="mt-1 block w-full"
            autoComplete="new-password"
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>
        <div className="flex items-center gap-4">
          <button
            disabled={processing}
            type="submit"
            className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
            حفظ التعديلات
            <FaRegSave style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
          </button>
          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">حفظ.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
