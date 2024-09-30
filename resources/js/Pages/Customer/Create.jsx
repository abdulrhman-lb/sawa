import AcceptButton from "@/Components/Buttons/AcceptButton";
import RejectButton from "@/Components/Buttons/RejectButton copy";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import ScrollBar from "@/Components/ScrollBar";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import Title from "@/Components/Title";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FaUserTie } from "react-icons/fa";


export default function Create({
  auth, 
  message, 
  initialNotifications
 }) {
  
  const { data, setData, post, errors, reset } = useForm({
    name: '',
    phone: '',
    mobile: '',
    notes: '',
    created_by: auth.user.id
  })

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("customer.store"))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      notification={initialNotifications}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <FaUserTie className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              إنشاء زبون جديد
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="الزبائن" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div >
                <InputLabel
                  htmlFor="name"
                  value="الاسم الزبون"
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
              <div className="mt-4">
                <InputLabel
                  htmlFor="mobile"
                  value="رقم الموبايل"
                />
                <TextInput
                  id="mobile"
                  type="text"
                  name="mobile"
                  value={data.mobile}
                  className="mt-1 block w-full"
                  onChange={e => setData('mobile', e.target.value)}
                />
                <InputError message={errors.mobile} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="phone"
                  value="رقم الهاتف"
                />
                <TextInput
                  id="phone"
                  type="text"
                  name="phone"
                  value={data.phone}
                  className="mt-1 block w-full"
                  onChange={e => setData('phone', e.target.value)}
                />
                <InputError message={errors.phone} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="notes"
                  value="ملاحظات"
                />
                <TextAreaInput
                  id="notes"
                  name="notes"
                  value={data.notes}
                  className="mt-1 block w-full"
                  onChange={e => setData('notes', e.target.value)}
                />
                <InputError message={errors.notes} className="mt-2" />
              </div>
              <div className="mt-4 text-right ">
                <AcceptButton className="w-28 justify-center">موافق</AcceptButton>
                <Link href={route('customer.index')} >
                  <RejectButton className="w-28 justify-center">إلغاء الأمر</RejectButton>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  )
}
