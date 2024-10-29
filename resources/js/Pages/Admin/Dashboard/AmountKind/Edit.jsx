import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import ScrollBar from "@/Components/ScrollBar";
import SearchableDropdownForm from "@/Components/SearchableDropdownForm";
import TextInput from "@/Components/TextInput";
import Title from "@/Components/Title";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { FaRegSave } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { PiCashRegisterThin } from "react-icons/pi";

export default function Edit({
  auth,
  categories,
  products,
  services,
  kinds,
  amount_kind,
  message,
 }) {
  const { data, setData, post, processing, errors } = useForm({
    amount: amount_kind.amount || '0',
    kind: amount_kind.kind || 'const',
    service_id: amount_kind.service_id || '',
    kind_id: amount_kind.kind_id || '',
    _method: 'PUT'
  });

  const [category_id, setCategoryId] = useState(amount_kind.service.product.category_id || '');
  const [product_id, setProductId] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [disabled, setDisabled] = useState(data.kind === 'var');

  useEffect(() => {
    if (category_id) {
      const filteredProducts = products.data.filter(product => product.category_id === category_id);
      setFilteredProducts(filteredProducts || []);
      setFilteredServices([]);
      if (amount_kind.service && amount_kind.service.product && amount_kind.service.product.id) {
        setProductId(amount_kind.service.product.id);
      }
    }
  }, [category_id, categories]);

  useEffect(() => {
    if (product_id) {
      const service = services.data.filter(service => service.product_id === product_id);
      setFilteredServices(service || []);
      setData('service_id', amount_kind.service_id || '');
    }
  }, [product_id, filteredProducts]);

  useEffect(() => {
    if (amount_kind.service && amount_kind.service.product && amount_kind.service.product.id) {
      setProductId(amount_kind.service.product.id);
    }
  }, [amount_kind]);

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("amountkind.update", amount_kind.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <PiCashRegisterThin className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              تعديل سعر المنتج
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="تعديل سعر المنتج" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="px-4 sm:px-8 pt-4 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4">
                <div className="mt-1">
                  <InputLabel
                    htmlFor="category_id"
                    value="التصنيف"
                  />
                  <SearchableDropdownForm
                    items={categories.data}
                    value={category_id}
                    onChange={(value) => setCategoryId(value)}
                    placeholder="اختر التصنيف"
                    labelKey="name"
                    valueKey="id"
                  />
                  <InputError message={errors.category_id} className="mt-2" />
                </div>
                <div className="mt-1">
                  <InputLabel
                    htmlFor="product_id"
                    value="المنتج"
                  />
                  <SearchableDropdownForm
                    items={filteredProducts}
                    value={product_id}
                    onChange={(value) => setProductId(value)}
                    placeholder="اختر المنتج"
                    labelKey="name"
                    valueKey="id"
                    disabled={!category_id}
                  />
                  <InputError message={errors.product_id} className="mt-2" />
                </div>
                <div className="mt-1">
                  <InputLabel
                    htmlFor="service_id"
                    value="الخدمة"
                  />
                  <SearchableDropdownForm
                    items={filteredServices}
                    value={data.service_id}
                    onChange={(value) => setData('service_id', value)}
                    placeholder="اختر الخدمة"
                    labelKey="name"
                    valueKey="id"
                    disabled={!product_id}
                  />
                  <InputError message={errors.service_id} className="mt-2" />
                </div>
                <div className="mt-1">
                  <InputLabel
                    htmlFor="kind_id"
                    value="تفاصيل الخدمة"
                  />
                  <SearchableDropdownForm
                    items={kinds.data}
                    value={data.kind_id}
                    onChange={(value) => setData('kind_id', value)}
                    placeholder="اختر تفصيل الخدمة"
                    labelKey="name"
                    valueKey="id"
                    disabled={disabled}
                  />
                  <InputError message={errors.kind_id} className="mt-2" />
                </div>
                <div className="mt-1">
                  <InputLabel
                    htmlFor="kind"
                    value="طريقة الحساب"
                  />
                  <SearchableDropdownForm
                    items={[
                      { id: 'const', name: 'ثابت' },
                      { id: 'var', name: 'متغير' }
                    ]}
                    value={data.kind}
                    onChange={(value) => {
                      if (value === 'var') {
                        setData({ amount: 0, kind: value });
                        setDisabled(true);
                      } else {
                        setData('kind', value);
                        setDisabled(false);
                      }
                    }}
                    placeholder="اختر طريقة الحساب"
                    labelKey="name"
                    valueKey="id"
                  />
                  <InputError message={errors.kind} className="mt-2" />
                </div>
                <div className="mt-1">
                  <InputLabel
                    htmlFor="amount"
                    value="السعر"
                  />
                  <TextInput
                    id="amount"
                    type="number"
                    min="0"
                    name="amount"
                    value={data.amount}
                    className="block w-full h-10"
                    disabled={disabled}
                    onChange={e => setData('amount', e.target.value)}
                    lang="en"
                  />
                  <InputError message={errors.amount} className="mt-2" />
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
                <Link href={route('amountkind.index')} >
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
    </AuthenticatedLayout>
  );
}