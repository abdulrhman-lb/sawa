import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchableDropdownForm from "@/Components/SearchableDropdownForm";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Create({ auth, comissions, categories, products, services, amount_kinds, users }) {
  const { data, setData, post, errors, reset } = useForm({
    user_id: '',
    amount_kind_id: '',
    comission_admin: '0',
    notes: '',
    officer_id: auth.user.id
  });

  const [category_id, setCategoryId] = useState('');
  const [product_id, setProductId] = useState('');
  const [service_id, setServiceId] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredAmountKins, setFilteredAmountKinds] = useState([]);
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
      setFilteredAmountKinds([]); // Reset services when category changes
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
      setFilteredAmountKinds([]); // Reset services when category changes
      setData('service_id', ''); // Reset selected service
    }
  }, [product_id, filteredProducts]);

  // Update amount kinds based on selected service_id
  useEffect(() => {
    if (service_id) {
      const amount_kind_S = amount_kinds.data.filter(amount_kind => {
        const isServiceMatch = amount_kind.service_id === service_id;
        const comissionData = comissions.data.find(comm =>
          (comm.user_id === auth.user.id && comm.amount_kind_id === amount_kind.id) || (auth.user.kind === 'admin')
        );
        return isServiceMatch && comissionData;
      });
      const amount_kind = amount_kind_S
        .map(amount_kind => ({
          ...amount_kind,
          kindName: amount_kind.kindName.name // Create a new field with the linked kind name
        }));

      if (amount_kind.length > 0) {
        setFilteredAmountKinds(amount_kind);
      } else {
        setFilteredAmountKinds([]);
      }

      setData('service_id', ''); // Reset selected service
    }
  }, [service_id, filteredServices]);


  const onSubmit = (e) => {
    e.preventDefault();
    console.log('bb');
    post(route("comission.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            إنشاء عمولة جديد
          </h2>
        </div>
      }
    >
      <Head title="العمولات" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className=" p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="grid lg:grid-cols-3 sm:grid-cols-1">
                <div className="mt-4 px-3">
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
                <div className="mt-4 px-3">
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
                <div className="mt-4 px-3">
                  <InputLabel
                    htmlFor="service_id"
                    value="الخدمة"
                  />
                  <SearchableDropdownForm
                    items={filteredServices}
                    value={data.service_id}
                    onChange={(value) => setServiceId(value)}
                    placeholder="اختر الخدمة"
                    labelKey="name"
                    valueKey="id"
                    disabled={!product_id} // Disable if no product selected
                  />
                  <InputError message={errors.service_id} className="mt-2" />
                </div>
                <div className="mt-4 px-3">
                  <InputLabel
                    htmlFor="kind_id"
                    value="تفاصيل الخدمة"
                  />
                  <SearchableDropdownForm
                    items={filteredAmountKins}
                    value={data.amount_kind_id}
                    onChange={(value) => setData('amount_kind_id', value)}
                    placeholder="اختر تفاصيل الخدمة"
                    labelKey='kindName'
                    valueKey="id"
                    disabled={!product_id} // Disable if no product selected
                  />
                  <InputError message={errors.kind_id} className="mt-2" />
                </div>
                <div className="mt-4 px-3">
                  <InputLabel
                    htmlFor="user_id"
                    value="المستخدم"
                  />
                  <SearchableDropdownForm
                    items={users.data}
                    value={data.user_id}
                    onChange={(value) => setData('user_id', value)}
                    placeholder="اختر المستخدم"
                    labelKey="name"
                    valueKey="id"
                    disabled={false} // Disable if no product selected
                  />
                  <InputError message={errors.user_id} className="mt-2" />
                </div>
                <div className="mt-4 px-3">
                  <InputLabel
                    htmlFor="comission_admin"
                    value="العمولة"
                  />
                  <TextInput
                    id="comission_admin"
                    type="number"
                    name="comission_admin"
                    value={data.comission_admin}
                    className=" block w-full h-[40px]"
                    disabled={disabled}
                    onChange={e => setData('comission_admin', e.target.value)}
                  />
                  <InputError message={errors.comission_admin} className="mt-2" />
                </div>
              </div>
              <div className="mt-4 px-3">
                <InputLabel
                  htmlFor="category_notes"
                  value="ملاحظات"
                />
                <TextAreaInput
                  id="category_notes"
                  name="notes"
                  value={data.notes}
                  className="mt-1 block w-full"
                  onChange={e => setData('notes', e.target.value)}
                />
                <InputError message={errors.notes} className="mt-2" />
              </div>
              <div className="mt-4 text-right px-3">
                <button className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
                <Link href={route('comission.index')} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
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
