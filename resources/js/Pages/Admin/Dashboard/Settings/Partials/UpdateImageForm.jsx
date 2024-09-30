import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useState } from 'react';

export default function UpdateImageForm({ 
  className = '', 
  success, 
  message 
}) {

  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    image: message.image,
    _method: 'PUT'
  });
  const [selectedImage, setSelectedImage] = useState(data['image']);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
    setData('image', file);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route('settings.update.image', message.id));
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">لوغو التطبيق</h2>
      </header>
      <form onSubmit={submit} className='space-y-6'>
        <div className='flex justify-center'>
          <div className="relative inline-block items-center justify-end">
            <img
              src={selectedImage}
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
        <div className="flex items-center gap-4 justify-center">
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
