import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchableDropdownForm from "@/Components/SearchableDropdownForm";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Create({ auth, categories, products, services, kinds }) {
  const { data, setData, post, errors, reset } = useForm({
    amount: '0',
    kind: 'const',
    service_id: '',
    kind_id: ''
  });

  const [category_id, setCategoryId] = useState('');
  const [product_id, setProductId] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [disabled, setDisabled] = useState(false);

  // Update products based on selected category_id
  useEffect(() => {
    if (category_id) {
      const product = products.data.filter(product => product.category_id === category_id);
      if (product) {
        setFilteredProducts(product);
      } else {
        setFilteredProducts([]);
      }
      setFilteredServices([]); // Reset services when category changes
      setProductId(''); // Reset selected product
      setData('service_id', ''); // Reset selected service
    }
  }, [category_id, categories]);

  // Update services based on selected product_id
  useEffect(() => {
    if (product_id) {
      const service = services.data.filter(service => service.product_id === product_id);
      if (service) {
        setFilteredServices(service);
      } else {
        setFilteredServices([]);
      }
      setData('service_id', ''); // Reset selected service
    }
  }, [product_id, filteredProducts]);

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("amountkind.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            إنشاء سعر جديد
          </h2>
        </div>
      }
    >
      <Head title="أسعار المنتجات" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div>
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
              <div className="mt-4">
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
                  disabled={!category_id} // Disable if no category selected
                />
                <InputError message={errors.product_id} className="mt-2" />
              </div>
              <div className="mt-4">
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
                  disabled={!product_id} // Disable if no product selected
                />
                <InputError message={errors.service_id} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="kind_id"
                  value="تفاصيل"
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
              <div className="mt-4">
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
                      setData({amount: 0, kind: value });
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
              <div className="mt-4">
                <InputLabel
                  htmlFor="amount"
                  value="السعر"
                />
                <TextInput
                  id="amount"
                  type="number"
                  name="amount"
                  value={data.amount}
                  className="mt-1 block w-full"
                  disabled={disabled}
                  onChange={e => setData('amount', e.target.value)}
                />
                <InputError message={errors.amount} className="mt-2" />
              </div>
              <div className="mt-4 text-right ">
                <button className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
                <Link href={route('amountkind.index')} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
                  إلغاء الأمر
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
