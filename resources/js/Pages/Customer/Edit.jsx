import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";


export default function Edit({ auth, customer }) {
  const { data, setData, post, errors, reset } = useForm({
    name: customer.name || "",
    phone: customer.phone || "",
    mobile: customer.mobile || "",
    notes: customer.notes || "",
    _method: 'PUT'
  })

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("customer.update", customer.id))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          تعديل بيانات الزبون  "{customer.name}"
          </h2>
        </div>
      }
    >
      <Head title="الزبائن" />
      <div className="py-6">
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
                <button className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
                <Link href={route('customer.index')} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
                  إلغاء الأمر
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  )
}
