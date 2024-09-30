import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { STATUS_CLASS_MAP, STATUS_TEXT_MAP } from "@/constants";
import DeleteButton from "@/Components/Buttons/DeleteButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import AddButton from "@/Components/Buttons/AddButton";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import { AiOutlineProduct } from "react-icons/ai";

export default function index({ 
  auth, 
  products, 
  categories, 
  queryParams = null, 
  success, 
  message, 
  initialNotifications
 }) {

  queryParams = queryParams || {}
  
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    queryParams.page = 1;
    router.get(route('product.index'), queryParams)
  }

  const onKeyPress = (name, e) => {
    if (e.key !== 'Enter') return;
    searchFieldChanged('name', e.target.value);
  }

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === 'asc') {
        queryParams.sort_direction = 'desc';
      } else {
        queryParams.sort_direction = 'asc';
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }
    queryParams.page = 1;
    router.get(route('product.index'), queryParams)
  }

  const colChanged = (name, value) => {
    queryParams[name] = value;
    queryParams.page = 1;
    router.get(route('product.index'), queryParams)
  }

  const deleteProduct = (product) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذا المنتج؟')) {
      return;
    }
    router.post(route('product.destroy', product.id), {
      _method: 'DELETE',
    })
  }
  const editProduct = (product) => {
    router.get(route("product.edit", product))
  }
  const addProduct = () => {
    router.get(route("product.create"))
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
              المنتجات
            </Title>
            <AddButton onClick={e => addProduct()}>إضافة</AddButton>
          </ScrollBar>
        </div>
      }
    >
      <Head title="المنتجات" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<SuccessMessage message={success} />)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-2 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-md font-semibold text-left rtl:text-right text-gray-800 dark:text-gray-200">
                  <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                    <TableHeading
                        sortable={false}
                      >
                        #
                      </TableHeading>
                      <TableHeading
                        name='image'
                        sortable={false}
                      >
                        الصورة
                      </TableHeading>
                      <TableHeading
                        name='name'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المنتج
                      </TableHeading>
                      <TableHeading
                        name='category_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        التصنيف
                      </TableHeading>
                      <TableHeading
                        name='status'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        الحالة
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        التحكم
                      </TableHeading>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.name}
                          placeholder="المنتج"
                          onBlur={e => searchFieldChanged('name', e.target.value)}
                          onKeyPress={e => onKeyPress('name', e)}
                        >
                        </TextInput>
                      </th>
                      <th className="px-3 py-3">
                        <SelectInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.category_id}
                          onChange={e => searchFieldChanged('category_id', e.target.value)}
                        >
                          <option value="">اختر التصنيف</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3">
                        <SelectInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.status}
                          onChange={e => searchFieldChanged('status', e.target.value)}
                        >
                          <option value="">اختر الحالة</option>
                          <option value="active">فعال</option>
                          <option value="inactive">غير فعال</option>
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {products.data.map((product, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={product.id}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2 text-center"><img src={product.image} className="mx-auto rounded-full h-[70px] w-[70px] object-cover" style={{ width: 60, height: 60 }} /></td>
                        <td className="px-3 py-2 text-nowrap">
                          <Link href={route("product.show", product.id)}>
                            {product.name}
                          </Link>
                        </td>
                        <td className="px-3 py-2">{product.category.name}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={"px-2 py-0 cursor-pointer rounded text-white text-nowrap font-normal " +
                            STATUS_CLASS_MAP[product.status]} >
                            {STATUS_TEXT_MAP[product.status]}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-nowrap">
                          <PrimaryButton onClick={e => editProduct(product)}>تعديل</PrimaryButton>
                          <DeleteButton onClick={e => deleteProduct(product)}>حذف</DeleteButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex px-4">
                <SelectInput
                  className="text-sm font-medium mt-4"
                  defaultValue={queryParams.col}
                  onChange={e => colChanged('col', e.target.value)}
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                  <option value="100">100</option>
                </SelectInput>
                <div className="flex mx-auto">
                  <Pagination links={products.meta.links} queryParams={queryParams} />
                </div>
                <div className="mt-4">
                  <h3>إجمالي السجلات : {products.data.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
