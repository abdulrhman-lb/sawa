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
import { FaRegSave } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";


export default function Edit({ 
  auth, 
  product, 
  categories, 
  users, 
  message, 
}) {

  const { data, setData, post, errors, processing, reset } = useForm({
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
                  <div className="flex justify-center text-center py-4">
                    <button
                      disabled={processing}
                      type="submit"
                      className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                      موافق
                      <FaRegSave style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                    </button>
                    <Link href={route('product.index')} >
                      <button
                        type="button"
                        className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                        إلغاء الأمر
                        <MdOutlineCancel style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
                      </button>
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
