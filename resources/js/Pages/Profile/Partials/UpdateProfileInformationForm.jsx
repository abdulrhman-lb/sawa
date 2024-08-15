import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import SelectInput from '@/Components/SelectInput';

export default function UpdateProfileInformation({ className = '' , success}) {
  const user = usePage().props.auth.user;

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    user_name: user.user_name,
    email: user.email,
    phone: user.phone,
    mobile: user.mobile,
    address: user.address,
    center: user.center,
    kind: user.kind,
    status: user.status,
  });

  const submit = (e) => {
    e.preventDefault();
    console.log(data);
    patch(route('profile.update'));
  };

  return (
    <section className={className}>
      {success && (<div className="bg-emerald-500 py-2 px-4 mr-0 text-white rounded mb-4">
        {success}
      </div>)}
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">معلومات الملف الشخصي</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          قم بتحديث معلومات الملف الشخصي لحسابك وعنوان البريد الإلكتروني.
        </p>
      </header>

      <form onSubmit={submit} className='space-y-6'>
        <div className='mt-6'>
          <InputLabel htmlFor="name" value="الاسم الكامل" />
          <TextInput
            id="name"
            className="mt-1 block w-full"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            required
            isFocused
            autoComplete="name"
          />
          <InputError className="mt-2" message={errors.name} />
        </div>
        <div className=" mt-6 space-y-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          <div className='mt-6'>
            <InputLabel htmlFor="user_name" value="اسم المستخدم" />
            <TextInput
              id="user_name"
              className="mt-1 block w-full"
              value={data.user_name}
              onChange={(e) => setData('user_name', e.target.value)}
              required
              autoComplete="user_name"
            />
            <InputError className="mt-2" message={errors.user_name} />
          </div>

          <div>
            <InputLabel htmlFor="email" value="البريد الالكتروني" />
            <TextInput
              id="email"
              type="email"
              className="mt-1 block w-full"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              required
              autoComplete="username"
            />
            <InputError className="mt-2" message={errors.email} />
          </div>

          <div>
            <InputLabel htmlFor="phone" value="رقم الهاتف" />
            <TextInput
              id="phone"
              className="mt-1 block w-full"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              autoComplete="phone"
            />
            <InputError className="mt-2" message={errors.phone} />
          </div>

          <div>
            <InputLabel htmlFor="mobile" value="رقم الموبايل" />
            <TextInput
              id="mobile"
              className="mt-1 block w-full"
              value={data.mobile}
              onChange={(e) => setData('mobile', e.target.value)}
              autoComplete="mobile"
            />
            <InputError className="mt-2" message={errors.mobile} />
          </div>

          <div>
            <InputLabel htmlFor="address" value="العنوان" />
            <TextInput
              id="address"
              className="mt-1 block w-full"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              autoComplete="address"
            />
            <InputError className="mt-2" message={errors.address} />
          </div>

          <div>
            <InputLabel htmlFor="center" value="اسم المركز" />
            <TextInput
              id="center"
              className="mt-1 block w-full"
              value={data.center}
              onChange={(e) => setData('center', e.target.value)}
              autoComplete="center"
            />
            <InputError className="mt-2" message={errors.center} />
          </div>

          <div>
            <InputLabel htmlFor="kind" value="نوع المستخدم" />
            <SelectInput
              className="mt-1 block w-full"
              defaultValue={data.kind}
              onChange={(e) => setData('kind', e.target.value)}
              disabled 
            >
              <option value="admin">مدير نظام</option>
              <option value="super_user">مركز توزيع</option>
              <option value="user">مركز بيع</option>
            </SelectInput>
            <InputError className="mt-2" message={errors.kind} />
          </div>

          <div>
            <InputLabel htmlFor="status" value="حالة المستخدم" />
            <SelectInput
              className="mt-1 block w-full"
              defaultValue={data.status}
              onChange={(e) => setData('status', e.target.value)}
              disabled
            >
              <option value="active">فعال</option>
              <option value="inactive">غير فعال</option>
            </SelectInput>
            <InputError className="mt-2" message={errors.status} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>حفظ</PrimaryButton>
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
