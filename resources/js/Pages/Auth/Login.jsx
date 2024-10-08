import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword, message }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('login'));
  };

  return (
    <GuestLayout>
      <Head title="تسجيل دخول" />

      {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

      <form onSubmit={submit} className='mt-2'>
        <div>
          <img src={message.image} className='rounded-full mx-auto w-[90px] h-[90px] lg:w-[150px] lg:h-[150px]' alt="" />
          <InputLabel htmlFor="email" value="البريد الالكتروني" />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            isFocused={true}
            onChange={(e) => setData('email', e.target.value)}
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="mt-1 lg:mt-4">
          <InputLabel htmlFor="password" value="كلمة المرور" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="current-password"
            onChange={(e) => setData('password', e.target.value)}
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="flex items-center justify-center mt-4 lg:mt-12">
          <PrimaryButton className="ms-4" disabled={processing}>
            تسجيل دخول
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
