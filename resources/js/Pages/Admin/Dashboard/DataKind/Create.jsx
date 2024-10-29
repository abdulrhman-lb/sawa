import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import ScrollBar from "@/Components/ScrollBar";
import TextInput from "@/Components/TextInput";
import Title from "@/Components/Title";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { AiOutlineDatabase } from "react-icons/ai";
import { FaRegSave } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

export default function Create({ 
  auth, 
  message, 
 }) {
  
  const { data, setData, post, errors, processing, reset } = useForm({
    name: '',
  })

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("datakind.store"))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <AiOutlineDatabase className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              إنشاء نوع بيانات خدمة جديد
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="أنواع بيانات الخدمات" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="grid lg:grid-cols-3 sm:grid-cols-1">
                <div>
                  <InputLabel
                    htmlFor="name"
                    value="نوع بيانات الخدمة"
                  />
                  <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    isFocused={true}
                    className="mt-1 block w-full"
                    onChange={e => setData('name', e.target.value)}
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="flex justify-center text-center py-4 mt-4">
                  <button
                    disabled={processing}
                    type="submit"
                    className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                    موافق
                    <FaRegSave style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                  </button>
                  <Link href={route('datakind.index')} >
                    <button
                      type="button"
                      className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                      إلغاء الأمر
                      <MdOutlineCancel style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
                    </button>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
