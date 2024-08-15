import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";


export default function Create({ auth }) {
  const { data, setData, post, errors, reset } = useForm({
    name: '',
    email: '',
    user_name: '',
    phone: '',
    mobile: '',
    address: '',
    center: '',
    kind: 'admin',
    status: 'active',
    password: '',
    password_confirmation: '',
    created_by: auth.user.id
  })

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("user.store"))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center mt-14">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            إنشاء مستخدم جديد
          </h2>
        </div>
      }
    >
      <Head title="Users" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="mt-4">
                <InputLabel
                  htmlFor="name"
                  value="الاسم الكامل"
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
              <div className=" mt-6 space-y-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                <div className="mt-4">
                  <InputLabel
                    htmlFor="user_name"
                    value="اسم المستخدم"
                  />
                  <TextInput
                    id="user_name"
                    type="text"
                    name="user_name"
                    value={data.user_name}
                    isFocused={true}
                    className="mt-1 block w-full"
                    onChange={e => setData('user_name', e.target.value)}
                  />
                  <InputError message={errors.user_name} className="mt-2" />
                </div>
                <div className="mt-4">
                  <InputLabel
                    htmlFor="email"
                    value="البريد الالكتروني"
                  />
                  <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    onChange={e => setData('email', e.target.value)}
                  />
                  <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                  <InputLabel
                    htmlFor="user_password"
                    value="Password"
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
                    value="Confirm Password"
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
                    isFocused={true}
                    className="mt-1 block w-full"
                    onChange={e => setData('phone', e.target.value)}
                  />
                  <InputError message={errors.phone} className="mt-2" />
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
                    isFocused={true}
                    className="mt-1 block w-full"
                    onChange={e => setData('mobile', e.target.value)}
                  />
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
                    isFocused={true}
                    className="mt-1 block w-full"
                    onChange={e => setData('address', e.target.value)}
                  />
                  <InputError message={errors.address} className="mt-2" />
                </div>
                <div className="mt-4">
                  <InputLabel
                    htmlFor="center"
                    value="اسم المركز"
                  />
                  <TextInput
                    id="center"
                    type="text"
                    name="center"
                    value={data.center}
                    isFocused={true}
                    className="mt-1 block w-full"
                    onChange={e => setData('center', e.target.value)}
                  />
                  <InputError message={errors.center} className="mt-2" />
                </div>

                <div className="mt-4">
                  <InputLabel htmlFor="kind" value="نوع المستخدم" />
                  <SelectInput
                    className="mt-1 block w-full"
                    defaultValue={data.kind}
                    onChange={(e) => setData('kind', e.target.value)}
                  >
                    {(auth.user.kind === "admin") ? <option value="admin">مدير نظام </option> : null}
                    {(auth.user.kind === "admin") ? <option value="super_user">مركز توزيع</option> : null}
                    <option value="user">مركز بيع</option>
                  </SelectInput>
                  <InputError className="mt-2" message={errors.kind} />
                </div>

                <div className="mt-4">
                  <InputLabel htmlFor="status" value="حالة المستخدم" />
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

                <div className="mt-4 text-right ">
                  <button className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
                  <Link href={route('user.index')} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
                    إلغاء الأمر
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
