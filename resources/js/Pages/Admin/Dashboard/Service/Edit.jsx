import AcceptButton from "@/Components/Buttons/AcceptButton";
import RejectButton from "@/Components/Buttons/RejectButton copy";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import ScrollBar from "@/Components/ScrollBar";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import Title from "@/Components/Title";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { GrServicePlay } from "react-icons/gr";


export default function Edit({ 
  auth, 
  service, 
  products, 
  data_kinds, 
  message, 
  initialNotifications
 }) {
  
  const { data, setData, post, errors, reset } = useForm({
    image: '',
    name: service.name || "",
    status: service.status || "",
    notes: service.notes || "",
    product_id: service.product_id || "",
    data_kind_id_1: service.data_kind_id_1 || "",
    data_kind_id_2: service.data_kind_id_2 || "",
    _method: 'PUT'
  })

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("service.update", service.id))
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
              <GrServicePlay className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              تعديل المنتج "{service.name}"
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="المنتجات" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="px-4 sm:px-8 pt-4 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4">
                <div>
                  <InputLabel
                    htmlFor="name"
                    value="اسم الخدمة"
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
                <div>
                  <InputLabel
                    htmlFor="product_id"
                    value="المنتج"
                  />
                  <SelectInput
                    id="product_id"
                    name="product_id"
                    className="mt-1 block w-full"
                    onChange={e => setData('product_id', e.target.value)}
                    value={data.product_id}
                  >
                    <option value="0">اختر المنتج</option>
                    {products.data.map((category) => (
                      <option value={category.id} key={category.id}>{category.name}</option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.product_id} className="mt-2" />
                </div>
                <div>
                  <InputLabel
                    htmlFor="status"
                    value="الحالة"
                  />
                  <SelectInput
                    id="status"
                    name="status"
                    className="mt-1 block w-full"
                    onChange={e => setData('status', e.target.value)}
                    value={data.status}
                  >
                    <option value="active">فعال</option>
                    <option value="inactive">غير فعال</option>
                  </SelectInput>
                  <InputError message={errors.status} className="mt-2" />
                </div>
                <div>
                  <InputLabel
                    htmlFor="data_kind_id_1"
                    value="نوع البيانات الأول"
                  />
                  <SelectInput
                    id="data_kind_id_1"
                    name="data_kind_id_1"
                    className="mt-1 block w-full"
                    onChange={e => setData('data_kind_id_1', e.target.value)}
                    value={data.data_kind_id_1}
                  >
                    <option value="">اختر نوع البيانات الأول</option>
                    {data_kinds.data.map((data_kind) => (
                      <option value={data_kind.id} key={data_kind.id}>{data_kind.name}</option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.data_kind_id_1} className="mt-2" />
                </div>
                <div>
                  <InputLabel
                    htmlFor="data_kind_id_2"
                    value="نوع البيانات الثاني"
                  />
                  <SelectInput
                    id="data_kind_id_2"
                    name="data_kind_id_2"
                    className="mt-1 block w-full"
                    onChange={e => setData('data_kind_id_2', e.target.value)}
                    value={data.data_kind_id_2}
                  >
                    <option value="">اختر نوع البيانات الثاني</option>
                    {data_kinds.data.map((data_kind) => (
                      <option value={data_kind.id} key={data_kind.id}>{data_kind.name}</option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.data_kind_id_2} className="mt-2" />
                </div>
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
              <div className="text-center py-4">
                <AcceptButton className="w-28 justify-center">موافق</AcceptButton>
                <Link href={route('service.index')} >
                  <RejectButton className="w-28 justify-center">إلغاء الأمر</RejectButton>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
