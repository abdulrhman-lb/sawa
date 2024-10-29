import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import ScrollBar from "@/Components/ScrollBar";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import Title from "@/Components/Title";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FaRegSave } from "react-icons/fa";
import { HiOutlineUserPlus } from "react-icons/hi2";
import { MdOutlineCancel } from "react-icons/md";

export default function Create({
  auth,
  message,
}) {

  const { data, setData, post, errors, processing, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    mobile: '',
    address: '',
    center: '',
    kind: 'user',
    status: 'active',
    password: '',
    process_order: 0,
    password_confirmation: '',
    created_by: auth.user.id
  })

const onSubmit = (e) => {
  e.preventDefault();
  post(route('user.store'));
}
  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <HiOutlineUserPlus className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              إنشاء مستخدم جديد
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="المراكز" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="p-3 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="space-y-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="mt-1">
                  <InputLabel
                    htmlFor="email"
                    value="البريد الالكتروني"
                  />
                  <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    isFocused={true}
                    className="mt-1 block w-full"
                    onChange={e => setData('email', e.target.value)}
                  />
                  <InputError message={errors.email} className="mt-2" />
                </div>
                <div>
                  <InputLabel
                    htmlFor="user_password"
                    value="كلمة المرور"
                  />
                  <TextInput
                    id="user_password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-1 block w-full"
                    onChange={e => setData('password', e.target.value)}
                  />
                  <InputError message={errors.password} className="mt-2" />
                </div>
                <div className="mt-4">
                  <InputLabel
                    htmlFor="user_password_confirmation"
                    value="تأكيد كلمة المرور"
                  />
                  <TextInput
                    id="user_password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="mt-1 block w-full"
                    onChange={e => setData('password_confirmation', e.target.value)}
                  />
                  <InputError message={errors.password_confirmation} className="mt-2" />
                </div>
                <div className="mt-2">
                  <InputLabel
                    htmlFor="name"
                    value="الاسم الكامل"
                  />
                  <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    onChange={e => setData('name', e.target.value)}
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>
                <div>
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
                <div>
                  <InputLabel
                    htmlFor="mobile"
                    value="رقم الموبايل"
                  />
                  <div className=" w-full flex h-11">
                    <TextInput
                      id="mobile"
                      type="text"
                      name="mobile"
                      value={data.mobile}
                      placeholder='9xxxxxxxx'
                      className="mt-1 block w-full rounded-e-none border-l-0 border border-gray-300 ml-0 text-left"
                      onChange={e => setData('mobile', e.target.value)}
                    />
                    <div
                      className=" mt-1 h-10 flex-shrink-0 inline-flex items-center py-1.5 px-4 font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                      type="button">
                      <svg fill="none" aria-hidden="true" className="h-4 w-4 me-2" viewBox="0 0 20 15">
                        <rect width="19.6" height="5" y="0" fill="#D02F44" />
                        <rect width="19.6" height="5" y="5" fill="#FFFFFF" />
                        <rect width="19.6" height="5" y="10" fill="#000000" />
                        <polygon fill="#008000" points="6,6 6.87,8.15 9.13,8.15 7.13,9.5 7.87,11.65 6,10.5 4.13,11.65 4.87,9.5 2.87,8.15 5.13,8.15" />
                        <polygon fill="#008000" points="14,6 14.87,8.15 17.13,8.15 15.13,9.5 15.87,11.65 14,10.5 12.13,11.65 12.87,9.5 10.87,8.15 13.13,8.15" />
                      </svg>
                      963+
                    </div>
                  </div>
                  <InputError message={errors.mobile} className="mt-2" />
                </div>
                <div className="mt-4">
                  <InputLabel
                    htmlFor="address"
                    value="العنوان"
                  />
                  <TextInput
                    id="address"
                    type="text"
                    name="address"
                    value={data.address}
                    className="mt-1 block w-full"
                    onChange={e => setData('address', e.target.value)}
                  />
                  <InputError message={errors.address} className="mt-2" />
                </div>
                <div>
                  <InputLabel
                    htmlFor="center"
                    value="اسم المركز"
                  />
                  <TextInput
                    id="center"
                    type="text"
                    name="center"
                    value={data.center}
                    className="mt-1 block w-full"
                    autoComplete="off"
                    onChange={e => setData('center', e.target.value)}
                  />
                  <InputError message={errors.center} className="mt-2" />
                </div>
                <div>
                  <InputLabel htmlFor="kind" value="نوع المركز" />
                  <SelectInput
                    className="mt-1 block w-full"
                    defaultValue={data.kind}
                    onChange={(e) => setData('kind', e.target.value)}
                  >
                    {(auth.user.kind === "admin") ? <option value="admin">مدير نظام </option> : null}
                    {(auth.user.kind === "admin") ? <option value="super_user">حساب تاجر مميز</option> : null}
                    <option value="user">مركز بيع عادي</option>
                  </SelectInput>
                  <InputError className="mt-2" message={errors.kind} />
                </div>
                <div>
                  <InputLabel htmlFor="status" value="حالة المركز" />
                  <SelectInput
                    className="mt-1 block w-full"
                    defaultValue={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                  >
                    <option value="active">فعال</option>
                    <option value="inactive">غير فعال</option>
                  </SelectInput>
                  <InputError className="mt-2" message={errors.status} />
                </div>
                <div className="flex justify-center text-center py-4">
                  <button
                    disabled={processing}
                    type="submit"
                    className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                    موافق
                    <FaRegSave style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                  </button>
                  <Link href={route('user.index')} >
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
