import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import SelectInput from '@/Components/SelectInput';
import { useState } from 'react';
import { FaRegSave } from 'react-icons/fa';

export default function UpdateProfileInformation({ className = '', success }) {
  const user = usePage().props.auth.user;
  const image = (user.image != null && user.image != '') ? user.image : '/images/profiles/noimage.jpg'
  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    user_name: user.user_name,
    email: user.email,
    phone: user.phone,
    mobile: user.mobile,
    address: user.address,
    center: user.center,
    kind: user.kind,
    status: user.status,
    image: '',
    _method: 'PUT'
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
    setData('image', file);
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('profile.update'));
  };

  return (
    <section className={className}>
      {success && (<div className="bg-emerald-500 py-2 px-4 mr-0 text-white rounded mb-4">
        {success}
      </div>)}
      <form onSubmit={submit} className='space-y-6'>
        <div className='justify-between mt-1 space-y-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4'>
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">معلومات الملف الشخصي</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              قم بتحديث معلومات الملف الشخصي لحسابك وعنوان البريد الإلكتروني.
            </p>
            <div className='mt-16'>
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
          </div>
          <div className='flex justify-center'>
            <div className="relative inline-block items-center justify-end">
              <img
                src={selectedImage || image}
                alt="Uploaded"
                className="w-[200px] h-[200px] object-cover rounded-full border-2"
              />
              <label htmlFor="image" className="absolute bottom-2 right-5 bg-white p-1 rounded-full cursor-pointer shadow-md">
                <img src="https://img.icons8.com/material-rounded/24/000000/camera.png" alt="camera icon" />
              </label>
              <input
                id="image"
                type="file"
                name="image"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </div>
        </div>
        <div className=" mt-2 space-y-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          <div className='mt-2'>
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
            <InputLabel htmlFor="status" value="حالة المركز" />
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
          <div className="flex items-center gap-4 justify-center pt-2">
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
        </div>
      </form>
    </section>
  );
}
