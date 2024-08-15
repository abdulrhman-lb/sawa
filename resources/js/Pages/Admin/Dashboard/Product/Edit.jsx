import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";


export default function Edit({ auth, product, categories, users }) {
  const { data, setData, post, errors, reset } = useForm({
    image: '',
    name: product.name || "",
    status: product.status || "",
    notes: product.notes || "",
    phone: product.phone || "",
    category_id: product.category_id || "",
    _method: 'PUT'
  })

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("product.update", product.id))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            تعديل المنتج "{product.name}"
          </h2>
        </div>
      }
    >
      <Head title="المنتجات" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              {product.image && <div className="mb-4">
                <img src={product.image} className="w-64" />
                </div>}
                <div>
                <InputLabel
                  htmlFor="category_id"
                  value="التصنيف"
                />
                <SelectInput
                  id="category_id"
                  name="category_id"
                  value={data.category_id}
                  className="mt-1 block w-full"
                  onChange={e => setData('category_id', e.target.value)}
                >
                  <option value="">اختر التصنيف</option>
                  {categories.data.map((category) => (
                    <option value={category.id} key={category.id}>{category.name}</option>
                  ))}
                </SelectInput>
                <InputError message={errors.category_id} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="image"
                  value="صورة المنتج"
                />
                <TextInput
                  id="image"
                  type="file"
                  name="image"
                  className="mt-1 block w-full"
                  onChange={e => setData('image', e.target.files[0])}
                />
                <InputError message={errors.image} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="name"
                  value="المنتج "
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
              <div className="mt-4">
                <InputLabel
                  htmlFor="status"
                  value="الحالة"
                />
                <SelectInput
                  id="status"
                  name="status"
                  value={data.status}
                  className="mt-1 block w-full"
                  onChange={e => setData('status', e.target.value)}
                >
                  <option value="">اختر الحالة</option>
                  <option value="active">فعال</option>
                  <option value="inactive">غير فعال</option>
                </SelectInput>
                <InputError message={errors.status} className="mt-2" />
              </div>
              <div className="mt-4 text-right ">
                <button className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
                <Link href={route('product.index')} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
                  إلغاء الأمر
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
