import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Content from './Content';
import { useState, useEffect } from 'react';
import TextAreaInput from '@/Components/TextAreaInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import ScrollBar from '@/Components/ScrollBar';
import SuccessMessage from '@/Components/SuccessMessage';
import Title from '@/Components/Title';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import AcceptButton from '@/Components/Buttons/AcceptButton';

export default function Index({
  auth,
  services,
  customers,
  amountKinds,
  comissions,
  remainingBalanceProduct,
  remainingBalanceCenter,
  success,
  message
}) {
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
  const [selectedService, setSelectedService] = useState(services.data[0]);
  const [filteredAmountKinds, setFilteredAmountKinds] = useState([]);
  const [selectedAmountKind, setSelectedAmountKind] = useState(null);
  const [comission, setComission] = useState(0);
  const [isComissionManual, setIsComissionManual] = useState(false);
  const [dataKind1, setDataKind1] = useState('');
  const [dataKind2, setDataKind2] = useState('');
  const [balanceProduct, setBalanceProduct] = useState('');
  const [balanceCenter, setBalanceCenter] = useState('');

  const resetFields = () => {
    setComission(0);
    setSelectedAmountKind(null);
    reset();
  };

  useEffect(() => {
    if (selectedService) {
      
      resetFields();
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
      reset();
      setComission(0);
    }
  }, [success]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (remainingBalanceProduct >= data.amount && remainingBalanceCenter >= data.amount) {
      setBalanceProduct('');
      setBalanceCenter('');
      post(route("order.store"));
    } else {
      if (remainingBalanceProduct < data.amount) {
        setBalanceProduct('لايوجد رصيد كافي للمنتج لاتمام العملية');
      }
      if (remainingBalanceCenter < data.amount) {
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
          <nav className="text-me text-gray-800 dark:text-gray-200 flex justify-between items-center">
            <Title>الخدمات</Title>
            <Link href="/" className="hover:underline p-2"> التصنيفات </Link> &nbsp;&gt;&nbsp;&nbsp;&nbsp;
            {selectedService && (
              <>
                <Link href={`/products?id=${selectedService.product.category.id}`} className="hover:underline text-nowrap">
                  {selectedService.product.category.name}
                </Link> &nbsp;&nbsp;&nbsp;&gt;&nbsp;
                <span className="text-gray-500 p-2 text-nowrap">{selectedService.product.name}</span>
              </>
            )}
          </nav>
          <ScrollBar message={message} />
        </div>
      }
    >
      <Head title="الخدمات" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<SuccessMessage message={success} />)}
          {(balanceProduct || balanceCenter) && (<div className="bg-red-500 py-2 px-4 text-white rounded mx-2 mt-2">
            {balanceProduct} - {balanceCenter}
          </div>)}

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 bg-gray-100 dark:bg-gray-900 dark:text-white max-w-7xl mx-auto">
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
              <div className="lg:col-span-7 p-2 bg-gray-200 dark:bg-gray-800 shadow-lg mb-6 ml-3 rounded-lg">
                <form onSubmit={onSubmit} className="p-2 sm:p-2 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                  <div className="flex justify-between items-center shadow-md px-3 rounded-md bg-token1 dark:bg-token2/40 text-white h-[50px]">
                    <p className='text-xl'>{selectedService.product.category.name} / {selectedService.product.name} / {selectedService.name}</p>
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
                      <AcceptButton >موافق</AcceptButton>
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
