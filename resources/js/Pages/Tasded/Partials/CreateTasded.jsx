import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import { FaRegSave } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { SiGooglebigquery } from "react-icons/si";

export default function CreateTasded({
  auth,
  success,
  className = '',
}) {
  const { data, setData, post, errors, processing, reset } = useForm({
    user_id: auth.user.id,
    phone: '',
    amount: 0
  })

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("tasded.store"))
  }

  return (
    <section className={className}>
      {success && (<div className="bg-emerald-500 py-2 px-4 mr-0 text-white rounded mb-4">
        {success}
      </div>)}
      <div className="bg-white dark:bg-gray-800 overflow-hidden sm:rounded-lg">
        <form onSubmit={onSubmit} className="px-2 bg-white dark:bg-gray-800 sm:rounded-lg">
          <div className="grid lg:grid-cols-3 sm:grid-cols-1">
            <div>
              <InputLabel
                htmlFor="phone"
                value="أدخل رقم الهاتف"
              />
              <TextInput
                id="phone"
                type="text"
                name="phone"
                value={data.phone}
                isFocused={true}
                className="mt-1 block w-full"
                onChange={e => setData('phone', e.target.value)}
              />
              <InputError message={errors.phone} className="mt-2" />
            </div>
            <div className="flex justify-center text-center py-4 mt-3">
              <button
                disabled={processing}
                type="submit"
                className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                استعلام
                <SiGooglebigquery style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
