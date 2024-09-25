import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import SelectInput from '@/Components/SelectInput';
import SuccessMessage from '@/Components/SuccessMessage';

export default function UpdateSupportNumberForm({ className = '' , message}) {

  const { data, setData, put, errors, processing, recentlySuccessful } = useForm({
    support_number: message.support_number,
    _method: 'PUT'
  });

  const submit = (e) => {
    e.preventDefault();
    put(route('settings.update.support', message.id));
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">رقم الدعم الفني</h2>
      </header>

      <form onSubmit={submit} className='space-y-6'>
        <div className='mt-4'>
          <TextInput
            id="name"
            className="mt-1 block w-full"
            value={data.support_number}
            onChange={(e) => setData('support_number', e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="flex items-center gap-4 justify-center">
          <PrimaryButton disabled={processing} >حفظ</PrimaryButton>
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
