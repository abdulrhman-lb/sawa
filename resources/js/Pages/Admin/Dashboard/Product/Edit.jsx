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
import { useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";


export default function Edit({ 
  auth, 
  product, 
  categories, 
  users, 
  message, 
  initialNotifications
}) {

  const { data, setData, post, errors, reset } = useForm({
    image: '',
    name: product.name || "",
    status: product.status || "",
    notes: product.notes || "",
    phone: product.phone || "",
    category_id: product.category_id || "",
    _method: 'PUT'
  })
  const image = (product.image != null && product.image != '') ? product.image : '/images/products/noimage.jpg'
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
    setData('image', file);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("product.update", product.id))
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
              <AiOutlineProduct className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              تعديل المنتج "{product.name}"
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
              <div className='justify-center grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'>
                <div className="order-2 lg:order-1">
                  <div>
                    <InputLabel
                      htmlFor="category_id"
                      value="التصنيف"
                    />
                    <SelectInput
                      id="category_id"
                      name="category_id"
                      className="mt-1 block w-full"
                      onChange={e => setData('category_id', e.target.value)}
                      value={data.category_id}
                    >
                      <option value="">اختر التصنيف</option>
                      {categories.data.map((category) => (
                        <option value={category.id} key={category.id}>{category.name}</option>
                      ))}
                    </SelectInput>
                    <InputError message={errors.project_id} className="mt-2" />
                  </div>
                  <div className="mt-4">
                    <InputLabel
                      htmlFor="name"
                      value="اسم المنتج"
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
                      className="mt-1 block w-full"
                      onChange={e => setData('phone', e.target.value)}
                    />
                    <InputError message={errors.phone} className="mt-2" />
                  </div >
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
                      <option value="active">فعال</option>
                      <option value="inactive">غير فعال</option>
                    </SelectInput>
                    <InputError message={errors.status} className="mt-2" />
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
                  <div className="text-center py-2">
                    <AcceptButton className="w-28 justify-center">موافق</AcceptButton>
                    <Link href={route('product.index')} >
                      <RejectButton className="w-28 justify-center">إلغاء الأمر</RejectButton>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-center items-center order-1 py-2 lg:order-2">
                  <div className="relative inline-block items-center justify-end">
                    <img
                      src={selectedImage || image}
                      alt="Uploaded"
                      className="w-[200px] h-[200px] object-cover rounded-full border-2"
                    />
                    <label htmlFor="image" className="absolute bottom-2 right-5 bg-white p-1 rounded-full cursor-pointer shadow-md">
                      <img src="https://img.icons8.com/material-rounded/24/000000/camera.png" alt="camera icon" />
                    </label>
                    <input
                      id="image"
                      type="file"
                      name="image"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
