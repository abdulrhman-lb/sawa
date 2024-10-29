import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FaRegSave } from 'react-icons/fa';
import SelectInput from '@/Components/SelectInput';

export default function UpdateTasdedForm({
  className = '',
  success,
  message
}) {

  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    tasded: message.tasded,
    _method: 'PUT'
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('settings.update.tasded', message.id));
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">صلاحية استعلام تسديد</h2>
      </header>
      <form onSubmit={submit} className='space-y-6'>
        <div className='mt-4'>
          <SelectInput
            id="tasded"
            name="status"
            className="mt-1 block w-full"
            value={message.tasded}
            onChange={e => setData('tasded', e.target.value)}
          >
            <option value="1">فعال</option>
            <option value="0">غير فعال</option>
          </SelectInput>
        </div>
        <div className="flex items-center gap-4 justify-center">
          <button
            disabled={processing}
            type="submit"
            className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
            حفظ
            <FaRegSave style={{ marginRight: '8px', marginTop: '2px' }} size={25} />
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
