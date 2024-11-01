import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import TextAreaInput from '@/Components/TextAreaInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import ScrollBar from '@/Components/ScrollBar';
import SuccessMessage from '@/Components/SuccessMessage';
import Title from '@/Components/Title';
import { GrServicePlay } from 'react-icons/gr';
import Content from './Content';
import { LuCheckCircle } from 'react-icons/lu';
import SearchableDropdownCustomer from '@/Components/SearchableDropdownCustomer';

export default function Index({
  auth,
  services,
  service,
  customers,
  amountKinds,
  comissions,
  remainingBalanceProduct,
  remainingBalanceCenter,
  success,
  message,
}) {
  const { data, setData, get, errors, processing, reset } = useForm({
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

  const dataKind1 = service.data_kind_id_1 ? service.data_kind_1.name : '';
  const dataKind2 = service.data_kind_id_2 ? service.data_kind_2.name : '';
  const [comission, setComission] = useState(0);
  const [isComissionManual, setIsComissionManual] = useState(service.kind === 'const' ? false : true);
  const [balanceProduct, setBalanceProduct] = useState('');
  const [balanceCenter, setBalanceCenter] = useState('');
  const [successMessage, setSuccessMessage] = useState(success);
  // console.log(successMessage);
  const handleSuccessClose = () => {
    setSuccessMessage(null); // إخفاء الرسالة بعد انتهاء المؤقت
  }

  const changeCustomer = (customer_id) => {
    console.log(customer_id);
    const CustomerData = customers.data.find(customer =>
      customer.id == customer_id
    );
    const dataKind = CustomerData ? CustomerData.phone : '';
    setData(prevData => ({
      ...prevData,
      customer_id: customer_id,
      data_kind_1: dataKind,
    }
    ));
  }

  // تحديث البيانات عند تغيير تفاصيل الخدمة المختارة
  const changeAmount = (amount_kind_id) => {
    const comissionData = comissions.data.find(comm =>
      comm.user_id === auth.user.id && comm.amount_kind_id == amount_kind_id
    );
    const comissionValueAdmin = comissionData ? comissionData.comission_admin : 0;
    const comissionValueSuper = comissionData ? comissionData.comission_super : 0;
    const comissionValue = comissionValueAdmin + comissionValueSuper;

    setComission(comissionValue);
    if (service.kind === 'const') {
      const netValue = comissionData.amount_kind.amount + (comissionData.amount_kind.amount * comissionValue) / 100;
      setData(prevData => ({
        ...prevData,
        comission_admin: comissionValueAdmin,
        comission_super: comissionValueSuper,
        net: netValue,
        amount: comissionData.amount_kind.amount,
        amount_kind_id: comissionData.amount_kind.id,
        service_id: comissionData.amount_kind.service_id,
      }
      ));
    } else {
      setData(prevData => ({
        ...prevData,
        comission_admin: comissionValueAdmin,
        comission_super: comissionValueSuper,
        net: 0,
        amount: 0,
        amount_kind_id: comissionData.amount_kind.id,
        service_id: comissionData.amount_kind.service_id,
      }
      ));
    }
  };

  useEffect(() => {
    if (service.kind === 'var' && amountKinds.data.length > 0) {
      changeAmount(amountKinds.data[0].id);
    }
  }, []); // المصفوفة الفارغة هنا تعني أن useEffect سيتم تنفيذه مرة واحدة فقط عند التحميل


  const selectService = (service, id) => {
    data.service_id = service.id
    get(route("service.select", { id }));
  };

  const changeAmountValue = (amount) => {
    if (isComissionManual && amount > 0 && comission >= 0) {
      const netValue = parseInt(amount) + ((amount * (data.comission_admin + data.comission_super)) / 100);
      setData(prevData => ({
        ...prevData,
        net: netValue,
        amount: amount,
      }
      ));
    }
  }

  // معالجة الإرسال
  const onSubmit = (e) => {
    e.preventDefault();
    if (remainingBalanceProduct >= data.amount && remainingBalanceCenter >= data.net) {
      setBalanceProduct('');
      setBalanceCenter('');
      get(route("order.send"));
    } else {
      if (remainingBalanceProduct < data.amount) {
        setBalanceProduct('لايوجد رصيد كافي للمنتج لاتمام العملية');
      }
      if (remainingBalanceCenter < data.net) {
        setBalanceCenter('لايوجد رصيد كافي لدى المركز لاتمام العملية');
      }
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className='flex justify-between items-center'>
          <ScrollBar message={message}>
            <nav className="text-me text-gray-800 dark:text-gray-200 flex justify-between items-center">
              <Title className="flex my-auto">
                <GrServicePlay className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
                <Link href="/" className="hover:underline p-2"> التصنيفات </Link>
                <span className='text-3xl lg:text-4xl'>|</span>
                {service && (
                  <>
                    <Link href={`/products?id=${service.product.category.id}`} className="hover:underline text-nowrap my-auto p-2">
                      {service.product.category.name}
                    </Link>
                    {/* <span className='text-3xl lg:text-4xl'>|</span>

                    <span className="text-gray-500 p-2 text-nowrap">{service.product.name}</span> */}
                  </>
                )}
              </Title>
            </nav>
          </ScrollBar>
        </div>
      }
    >
      <Head title="الخدمات" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {successMessage && (<SuccessMessage message={successMessage} onClose={handleSuccessClose} />)}
          {(balanceProduct || balanceCenter) && (<div className="bg-red-500 py-2 px-4 text-white rounded mx-2 mt-2">
            {balanceProduct} - {balanceCenter}
          </div>)}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 dark:text-white max-w-7xl mx-auto">
            {services.data.length > 0 ? (
              <div className="lg:col-span-3 flex flex-col space-y-1 ">
                {services.data.map((service) => (
                  <Content
                    key={service.id}
                    {...service}
                    onClick={() => selectService(service, service.product_id)}
                  />
                ))}
              </div>
            ) : (
              <div className="lg:col-span-10 p-5">
                <p className="text-center text-gray-500">لا يوجد خدمات متوفرة.</p>
              </div>
            )}
            {service && (
              <div className="lg:col-span-7 p-2 bg-gray-200 dark:bg-gray-800 shadow-lg mb-6 ml-3 rounded-lg w-full">
                <form onSubmit={onSubmit} className="p-2 sm:p-2 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                  <div className="flex justify-between items-center shadow-md px-3 rounded-md bg-blue-600 text-white h-[50px]">
                    <p className='text-xl'>{service.product.name} / {service.name}</p>
                    {/* <button className='text-xl font-semibold' onClick={() => setSelectedService(null)}>&times;</button> */}
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 gap-4">
                      <div className="flex-1">
                        <label>اختر الزبون:</label>
                        <SearchableDropdownCustomer
                          items={customers.data}
                          name="user_id"
                          className="w-full border border-red-800 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          // selectedItem={customers.data.find((user) => user.id === queryParams.user_id)}
                          // onSelectItem={handleSelectUser}
                          placeholder="اختر الزيون"
                          changeCustomer={changeCustomer} // تمرير دالة changeCustomer
                        />
{/* 
                        <select
                          className="w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={data.customer_id}
                          onChange={(e) => changeCustomer(e.target.value)}
                        >
                          <option value="1">غير محدد</option>
                          {customers.data.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                          ))}
                        </select> */}
                        <InputError message={errors.customer_id} className="mt-2" />
                      </div>
                      <div className="flex-1">
                        <label>اختر تفاصيل الخدمة:</label>
                        <select
                          className="w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={data.amount_kind_id}
                          onChange={(e) => changeAmount(e.target.value)}
                          disabled={isComissionManual}
                        >
                          {!isComissionManual && <option value="">اختر تفاصيل الخدمة</option>}
                          {amountKinds.data.map(kind => (
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
                            min={0}
                            onChange={e => isComissionManual && changeAmountValue(e.target.value)}
                            readOnly={!isComissionManual}
                            className="w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            lang="en"
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
                    <div className="mt-2 text-center">
                      <button
                        disabled={processing}
                        type="submit"
                        className="inline-flex text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                        موافق
                        <LuCheckCircle style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
