import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Content from './Content';
import { useState, useEffect } from 'react';
import TextAreaInput from '@/Components/TextAreaInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Index({ auth, services, customers, amountKinds, comissions, success }) {
  const { data, setData, post, errors, reset } = useForm({
    customer_id: 1,
    user_id: auth.user.id,
    service_id: 0,
    amount_kind_id: 0,
    comission_admin: 0,
    comission_super: 0,
    net: 0,
    amount: 0,
    status: 'in_progress',
    reject_reason: '',
    data_kind_1: '',
    data_kind_2: '',
    notes: ''
  });

  const [selectedService, setSelectedService] = useState();
  const [filteredAmountKinds, setFilteredAmountKinds] = useState([]);
  const [selectedAmountKind, setSelectedAmountKind] = useState(null);
  const [comission, setComission] = useState(0);
  const [isComissionManual, setIsComissionManual] = useState(false);
  const [dataKind1, setDataKind1] = useState('');
  const [dataKind2, setDataKind2] = useState('');

  const resetFields = () => {
    setComission(0);
    setSelectedAmountKind(null);
    reset();
  };

  // فلترة أنواع تفاصيل الخدمة عند اختيار خدمة
  useEffect(() => {
    if (selectedService) {
      resetFields();
      // فلترة القيم المرتبطة بالخدمة والمستخدم
      const filteredKinds = amountKinds.data.filter(kind => {
        const isServiceMatch = kind.service_id === selectedService.id;
        const comissionData = comissions.data.find(comm =>
          comm.user_id === auth.user.id && comm.amount_kind_id === kind.id
        );
        return isServiceMatch && comissionData;
      });
      setFilteredAmountKinds(filteredKinds);
      if (selectedService.kind === 'const') {
        setSelectedAmountKind(null);
        setIsComissionManual(false);
      }
      else {
        setIsComissionManual(true);
        if (selectedService.kind === 'var' && filteredKinds.length > 0) {
          const firstKind = filteredKinds[0];
          if (firstKind) {
            const comissionData = comissions.data.find(comm =>
              comm.user_id === auth.user.id && comm.amount_kind_id === firstKind.id
            );
            const comissionValueAdmin = comissionData ? comissionData.comission_admin : 0;
            const comissionValueSuper = comissionData ? comissionData.comission_super : 0;
            const comissionValue = comissionData ? comissionData.comission_admin + comissionData.comission_super : 0;
            setComission(comissionValue);
            const netValue = firstKind.amount + (firstKind.amount * comissionValue) / 100;
            setData(prevData => ({
              ...prevData,
              comission_admin: comissionValueAdmin,
              comission_super: comissionValueSuper,
              net: netValue,
              amount: firstKind.amount,
              amount_kind_id: firstKind.id,
              service_id: firstKind.service_id,
            }));
          }
        }
      }
      setDataKind1(selectedService.data_1.name || '');
      setDataKind2((selectedService.data_2 ? selectedService.data_2.name : ''));
    }
  }, [selectedService, comissions, auth.user.id, amountKinds]);

  // تحديث قيمة الخدمة والعمولة والصافي عند اختيار نوع تفاصيل الخدمة
  useEffect(() => {
    if (selectedAmountKind && selectedService.kind === 'const') {
      const amount_kind = filteredAmountKinds.find(kind => kind.id === parseInt(selectedAmountKind));
      if (amount_kind) {
        const comissionData = comissions.data.find(comm => comm.user_id === auth.user.id && comm.amount_kind_id === amount_kind.id);
        const comissionValueAdmin = comissionData ? comissionData.comission_admin : 0;
        const comissionValueSuper = comissionData ? comissionData.comission_super : 0;
        const comissionValue = comissionData ? comissionData.comission_admin + comissionData.comission_super : 0;
        setComission(comissionValue);
        const netValue = amount_kind.amount + (amount_kind.amount * comissionValue) / 100;
        setData(prevData => ({
          ...prevData,
          comission_admin: comissionValueAdmin,
          comission_super: comissionValueSuper,
          net: netValue,
          amount: amount_kind.amount,
          amount_kind_id: amount_kind.id,
          service_id: amount_kind.service_id,
        }));
      }
    }
  }, [selectedAmountKind, filteredAmountKinds, comissions, auth.user.id, setSelectedAmountKind]);

  // حساب الصافي يدويًا عند إدخال المبلغ والعمولة إذا كانت الخدمة من نوع "var"
  useEffect(() => {
    if (isComissionManual && data.amount > 0 && comission >= 0) {
      const netValue = parseInt(data.amount) + ((data.amount * (data.comission_admin + data.comission_super)) / 100);
      setData(prevData => ({
        ...prevData,
        net: netValue,
      }));
    }
  }, [data.amount, comission, isComissionManual]);

  useEffect(() => {
    if (success) {
      reset(); // تصفير الحقول عند استلام success
      setComission(0);
    }
  }, [success]);

  const onSubmit = (e) => {
    console.log(data);

    e.preventDefault();
    post(route("order.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className='flex justify-between items-center'>
          <nav className="text-me text-gray-800 dark:text-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight ml-10"> الخدمات </h2>
            <Link href="/" className="hover:underline p-2"> التصنيفات </Link> &nbsp;&gt;&nbsp;&nbsp;&nbsp;
            {selectedService && (
              <>
                <Link href={`/products?id=${selectedService.product.category.id}`} className="hover:underline">
                  {selectedService.product.category.name}
                </Link> &nbsp;&nbsp;&nbsp;&gt;&nbsp;
                <span className="text-gray-500 p-2">{selectedService.product.name}</span>
              </>
            )}
          </nav>
        </div>
      }
    >
      <Head title="الخدمات" />
      {success && (<div className="bg-emerald-500 py-2 px-4 text-white rounded mx-4 mt-4">
        {success}
      </div>)}

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 bg-gray-100 dark:bg-gray-900 dark:text-white pt-4 max-w-7xl mx-auto">
        {services.data.length > 0 ? (
          <div className="lg:col-span-3 flex flex-col space-y-1 ">
            {services.data.map((service) => (
              <Content
                key={service.id}
                {...service}
                onClick={() => setSelectedService(service)}
              />
            ))}
          </div>
        ) : (
          <div className="lg:col-span-10 p-5">
            <p className="text-center text-gray-500">لا يوجد خدمات متوفرة.</p>
          </div>
        )}

        {selectedService && (
          <div className="lg:col-span-7 p-5 bg-gray-200 dark:bg-gray-800 shadow-lg mb-6 ml-3 rounded-lg">

            <form onSubmit={onSubmit} className="p-2 sm:p-4 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="flex justify-between items-center shadow-md px-3 rounded-md bg-token1/40 dark:bg-token2/40 text-white h-[40px]">
                <p>{selectedService.product.category.name} / {selectedService.product.name} / {selectedService.name}</p>
                <button className='text-xl font-semibold' onClick={() => setSelectedService(null)}>&times;</button>
              </div>
              <div className="mt-4">
                <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 gap-4">
                  <div className="flex-1">
                    <label>اختر الزبون:</label>
                    <select
                      className="w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={data.customer_id}
                      onChange={(e) => setData('customer_id', e.target.value)}
                    >
                      {customers.data.map(customer => (
                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                      ))}
                    </select>
                    <InputError message={errors.customer_id} className="mt-2" />
                  </div>
                  <div className="flex-1">
                    <label>اختر تفاصيل الخدمة:</label>
                    <select
                      className="w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={data.amount_kind_id}
                      onChange={(e) => setSelectedAmountKind(e.target.value)}
                      disabled={isComissionManual}
                    >
                      {!isComissionManual && <option value="">اختر تفاصيل الخدمة</option>}
                      {filteredAmountKinds.map(kind => (
                        <option key={kind.id} value={kind.id}>{kind.kindName.name}</option>
                      ))}
                    </select>
                    <InputError message={errors.amount_kind_id} className="mt-2" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 lg:space-x-4 space-y-4 lg:space-y-0 mt-5">
                  <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-2 lg:ml-4">
                    <div className="flex-1">
                      <label>قيمة الخدمة:</label>
                      <input
                        type="number"
                        value={data.amount}
                        onChange={e => isComissionManual && setData('amount', e.target.value)}
                        readOnly={!isComissionManual}
                        className="w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <InputError message={errors.amount} className="mt-2" />
                    </div>
                    <div className="flex-1">
                      <label>العمولة:</label>
                      <input
                        type="text"
                        value={`${comission} %`}
                        onChange={e => isComissionManual && setComission(parseFloat(e.target.value))}
                        readOnly={!isComissionManual}
                        className="w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <InputError message={errors.comission_admin} className="mt-2" />
                    </div>
                    <div className="flex-1">
                      <label>الصافي:</label>
                      <input
                        type="text"
                        value={data.net}
                        readOnly
                        className="w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className={`grid ${dataKind2 ? 'lg:grid-cols-2' : 'sm:grid-cols-1'}`}>
                    {dataKind1 && (
                      <div className={`mb-4 ${dataKind2 && 'lg:ml-4'}`}>
                        <label>{dataKind1}</label>
                        <input
                          type="text"
                          value={data.data_kind_1}
                          onChange={e => setData('data_kind_1', e.target.value)}
                          className="w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      <InputError message={errors.data_kind_1} className="mt-2" />  
                      </div>
                    )}
                    {dataKind2 && (
                      <div className="mb-4">
                        <label>{dataKind2}</label>
                        <input
                          type="text"
                          value={data.data_kind_2}
                          onChange={e => setData('data_kind_2', e.target.value)}
                          className="w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className='lg:ml-4'>
                  <InputLabel htmlFor="category_notes" value="ملاحظات" />
                  <TextAreaInput
                    id="category_notes"
                    name="notes"
                    className="mt-1 block w-full h-10"
                    value={data.notes}
                    onChange={e => setData('notes', e.target.value)}
                  />
                </div>
                <div className="mt-4 text-right ">
                  <button className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
                  <Link href={route('service.home', selectedService)} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
                    إلغاء الأمر
                  </Link>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}