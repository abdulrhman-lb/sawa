import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateMessageForm({ 
  className = '' , 
  success, 
  message
}) {

  const { data, setData, put, errors, processing, recentlySuccessful } = useForm({
    messages: message.messages,
    _method: 'PUT'
  });

  const submit = (e) => {
    e.preventDefault();
    put(route('settings.update.message', message.id));
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">رسالة الإدارة</h2>
      </header>
      <form onSubmit={submit} className='space-y-6'>
        <div className='mt-4'>
          <TextInput
            id="name"
            className="mt-1 block w-full"
            value={data.messages}
            onChange={(e) => setData('messages', e.target.value)}
            isFocused
            autoComplete="name"
          />
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
