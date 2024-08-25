import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchableDropdownForm from "@/Components/SearchableDropdownForm";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Edit({ auth, categories, products, services, kinds, amount_kind }) {
  const { data, setData, put, errors } = useForm({
    amount: amount_kind.amount || '0',
    kind: amount_kind.kind || 'const',
    service_id: amount_kind.service_id || '',
    kind_id: amount_kind.kind_id || '',
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
    put(route("amountkind.update", amount_kind.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            تعديل سعر المنتج
          </h2>
        </div>
      }
    >
      <Head title="تعديل سعر المنتج" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className=" sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
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
                  disabled={!category_id}
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
                  disabled={!product_id}
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
                      setData({ kind_id: "", amount: 0, kind: value });
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
              <div className="mt-4 text-right">
                <button className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">تحديث</button>
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

// import InputError from "@/Components/InputError";
// import InputLabel from "@/Components/InputLabel";
// import SearchableDropdownForm from "@/Components/SearchableDropdownForm";
// import TextInput from "@/Components/TextInput";
// import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// import { Head, Link, useForm } from "@inertiajs/react";
// import { useState, useEffect } from "react";

// export default function Edit({ auth, services, kinds, categories, amount_kind }) {
//   const { data, setData, put, errors } = useForm({
//     amount: amount_kind.amount || '0',
//     kind: amount_kind.kind || 'const',
//     service_id: amount_kind.service_id || '',
//     kind_id: amount_kind.kind_id || ''
//   });

//   const [disabled, setDisabled] = useState(data.kind === 'var');

//   // Update kind_id options based on selected service_id
//   useEffect(() => {
//     if (data.service_id) {
//       setDisabled(false);
//       // Call API to get kinds based on service_id if needed
//     } else {
//       setDisabled(true);
//     }
//   }, [data.service_id]);

//   const onSubmit = (e) => {
//     e.preventDefault();
//     put(route("amountkind.update", amountKind.id));
//   };

//   return (
//     <AuthenticatedLayout
//       user={auth.user}
//       header={
//         <div className="flex justify-between items-center">
//           <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
//             تعديل سعر المنتج
//           </h2>
//         </div>
//       }
//     >
//       <Head title="تعديل سعر المنتج" />
//       <div className="py-6">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
//             <form onSubmit={onSubmit} className=" sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
//               <div className="mt-4">
//                 <InputLabel
//                   htmlFor="service_id"
//                   value="الخدمة"
//                 />
//                 <SearchableDropdownForm
//                   items={services.data}
//                   value={data.service_id}
//                   onChange={(value) => setData('service_id', value)}
//                   placeholder="اختر الخدمة"
//                   labelKey="name"
//                   valueKey="id"
//                 />
//                 <InputError message={errors.service_id} className="mt-2" />
//               </div>
//               <div className="mt-4">
//                 <InputLabel
//                   htmlFor="kind_id"
//                   value="تفاصيل"
//                 />
//                 <SearchableDropdownForm
//                   items={kinds.data}
//                   value={data.kind_id}
//                   onChange={(value) => setData('kind_id', value)}
//                   placeholder="اختر تفصيل الخدمة"
//                   labelKey="name"
//                   valueKey="id"
//                   disabled={disabled}
//                 />
//                 <InputError message={errors.kind_id} className="mt-2" />
//               </div>
//               <div className="mt-4">
//                 <InputLabel
//                   htmlFor="kind"
//                   value="طريقة الحساب"
//                 />
//                 <SearchableDropdownForm
//                   items={[
//                     { id: 'const', name: 'ثابت' },
//                     { id: 'var', name: 'متغير' }
//                   ]}
//                   value={data.kind}
//                   onChange={(value) => {
//                     if (value === 'var') {
//                       setData({ kind_id: "", amount: 0, kind: value });
//                       setDisabled(true);
//                     } else {
//                       setData('kind', value);
//                       setDisabled(false);
//                     }
//                   }}
//                   placeholder="اختر طريقة الحساب"
//                   labelKey="name"
//                   valueKey="id"
//                 />
//                 <InputError message={errors.kind} className="mt-2" />
//               </div>
//               <div className="mt-4">
//                 <InputLabel
//                   htmlFor="amount"
//                   value="السعر"
//                 />
//                 <TextInput
//                   id="amount"
//                   type="number"
//                   name="amount"
//                   value={data.amount}
//                   className="mt-1 block w-full"
//                   disabled={disabled}
//                   onChange={e => setData('amount', e.target.value)}
//                 />
//                 <InputError message={errors.amount} className="mt-2" />
//               </div>
//               <div className="mt-4 text-right">
//                 <button className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">تحديث</button>
//                 <Link href={route('amountkind.index')} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
//                   إلغاء الأمر
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </AuthenticatedLayout>
//   );
// }
