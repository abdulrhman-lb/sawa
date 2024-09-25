import AcceptButton from "@/Components/Buttons/AcceptButton";
import RejectButton from "@/Components/Buttons/RejectButton copy";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel"; 
import ScrollBar from "@/Components/ScrollBar";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import Title from "@/Components/Title";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";


export default function Create({ auth, user, message }) {
  const { data, setData, post, errors, reset } = useForm({
    name: user.name || "",
    email: user.email || "",
    user_name: user.user_name || "",
    phone: user.phone || "",
    mobile: user.mobile || "",
    address: user.address || "",
    center: user.center || "",
    kind: user.kind || "",
    status: user.status || "",
    created_by: user.created_by,
    password: "",
    password_confirmation: "",
    _method: 'PUT'
  })
  const onSubmit = (e) => {
    e.preventDefault();
    post(route("user.update", user.id))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <Title>تعديل بيانات المركز  "{user.name}"</Title>
          <ScrollBar message={message}/>
        </div>
      }
    >
      <Head title="Users" />
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
                <div className="text-center pt-8">
                  <AcceptButton className="w-28 justify-center">موافق</AcceptButton>
                  <Link href={route('user.index')} >
                    <RejectButton className="w-28 justify-center">إلغاء الأمر</RejectButton>
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
