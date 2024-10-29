import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import ScrollBar from "@/Components/ScrollBar";
import SearchableDropdownForm from "@/Components/SearchableDropdownForm";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import Title from "@/Components/Title";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FaRegSave, FaUserTie } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";


export default function Edit({
  auth,
  customer,
  message,
  products,
  amountKinds,
  services,
  product
}) {

  const [productId, setProductId] = useState(product ? product.id : null);
  const [filteredAmounts, setFilteredAmounts] = useState([]);

  const { data, setData, post, errors, processing, reset } = useForm({
    name: customer.name || "",
    phone: customer.phone || "",
    mobile: customer.mobile || "",
    amount_kind_id: customer.amount_kind_id || "",
    notes: customer.notes || "",
    created_by: customer.created_by,
    _method: 'PUT'
  })

  useEffect(() => {
    if (productId) {
      const service = services.filter(service => service.product_id === productId);
      const amountKind = amountKinds.data.filter(amountKind => amountKind.service_id === service[0].id);
      if (service) {
        setFilteredAmounts(amountKind);
      } else {
        setFilteredAmounts([]);
      }
    }
  }, [productId]);

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("customer.update", customer.id))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <FaUserTie className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              تعديل بيانات الزبون  "{customer.name}"
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="الزبائن" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="p-2 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="mt-4">
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
                    htmlFor="product_id"
                    value="المزود"
                    className="mb-1"

                  />
                  <SearchableDropdownForm
                    items={products}
                    value={productId}
                    onChange={(value) => setProductId(value)}
                    placeholder="اختر المزود"
                    labelKey="name"
                    valueKey="id"
                  />
                  <InputError message={errors.product_id} className="mt-2" />
                </div>
                <div className="mt-4">
                  <InputLabel
                    htmlFor="amount_kind"
                    value="السرعة"
                    className="mb-1"

                  />
                  <SelectInput
                    id="amount_kind_id"
                    name="amount_kind_id"
                    className="mt-1 block w-full"
                    onChange={e => setData('amount_kind_id', e.target.value)}
                    value={data.amount_kind_id}
                  >
                    <option value="">اختر السرعة</option>
                    {filteredAmounts.map((filteredAmount) => (
                      <option value={filteredAmount.id} key={filteredAmount.id}>{filteredAmount.kindName.name}</option>
                    ))}
                  </SelectInput>
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
              </div>
              <div className="flex justify-center text-center py-4">
                <button
                  disabled={processing}
                  type="submit"
                  className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                  موافق
                  <FaRegSave style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                </button>
                <Link href={route('customer.index')} >
                  <button
                    type="button"
                    className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                    إلغاء الأمر
                    <MdOutlineCancel style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  )
}
