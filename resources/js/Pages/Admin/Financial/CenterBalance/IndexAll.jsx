import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useEffect, useState } from "react";
import SearchableDropdown from "@/Components/SearchableDropdown";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import { MdOutlineAccountTree, MdOutlineAddCircleOutline, MdOutlineCancel } from "react-icons/md";
import SelectInput from "@/Components/SelectInput";
import { FiMinusCircle } from "react-icons/fi";
import { TbListDetails, TbProgress } from "react-icons/tb";
import { GiMoneyStack } from "react-icons/gi";
import { LuCheckCircle } from "react-icons/lu";

export default function index({
  auth,
  center_balances,
  users,
  total_add_all,
  total_reduce_all,
  total_profit_all,
  final_balance_all,
  total_user_balance_all,
  queryParams = null,
  message,
  success,
}) {
  queryParams = queryParams || {}

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [showMinusBalanceModal, setShowMinusBalanceModal] = useState(false);
  const [showAddBalanceFromUserModal, setShowAddBalanceFromUserModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [add, setAdd] = useState(0);
  const [addBalance, setAddBalance] = useState(0);
  const [minusBalance, setMinusBalance] = useState(0);
  const [statment, setStatment] = useState('');
  const [addError, setAddError] = useState('');
  const [addBalanceError, setAddBalanceError] = useState('');
  const [minusBalanceError, setMinusBalanceError] = useState('');
  const usersMenu = users.data.filter((center) => center.kind != "admin");
  const [buttonColor, setButtonColor] = useState('inline-flex');

  useEffect(() => {
    // دالة لتبديل اللون
    const toggleColor = () => {
      setButtonColor(prevColor =>
        prevColor === 'inline-flex text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-lg px-2 py-1.5 text-center me-2 mb-2'
          ?
          'inline-flex text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2 py-1.5 text-center me-2 mb-2'
          :
          'inline-flex text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-lg px-2 py-1.5 text-center me-2 mb-2'
      );
    };

    // إنشاء مؤقت لتبديل اللون كل ثانية
    const interval = setInterval(toggleColor, 500);

    // تنظيف المؤقت عند إلغاء التثبيت
    return () => clearInterval(interval);
  }, []);

  const openAddModal = (center_balance) => {
    setSelectedCenter(center_balance);
    setShowAddModal(true);
  }

  const openAddBalanceModal = (center_balance) => {
    setSelectedCenter(center_balance);
    setShowAddBalanceModal(true);
  }

  const openMinusBalanceModal = (center_balance) => {
    setSelectedCenter(center_balance);
    setShowMinusBalanceModal(true);
  }

  const openAddBalanceFromUserModal = (center_balance) => {
    setSelectedCenter(center_balance);
    setShowAddBalanceFromUserModal(true);
  }

  const openDetails = (center_balance) => {
    router.get(route('center-balance.index', { center_id: center_balance.center.id }));
  }

  const handleAdd = () => {
    if (add <= 0) {
      setAddError('القيمة يجب أن تكون أكبر من الصفر');
    } else {
      setAddError('');
    }
    if ((add > 0)) {
      router.post(route('center-balance.store'), {
        user_id: selectedCenter.center.id,
        add: add,
        reduce: 0,
        profit: 0,
        statment: statment || '-',
      });
      setShowAddModal(false);
      setStatment('');
      setAdd(0);
      setAddError(0);
    }
  }

  const handleAddBalance = () => {
    if (addBalance <= 0) {
      setAddBalanceError('القيمة يجب أن تكون أكبر من الصفر');
    } else {
      setAddBalanceError('');
    }
    if (addBalance > 0) {
      router.post(route('updateBalance'), {
        user_id: selectedCenter.center.id,
        addBalance: addBalance,
      });
      setShowAddBalanceModal(false);
      setAddBalanceError(0);
      setAddBalance(0);
    }
  }

  const handleMinusBalance = () => {
    if (minusBalance <= 0) {
      setMinusBalanceError('القيمة يجب أن تكون أكبر من الصفر');
    } else {
      setMinusBalanceError('');
    }
    if (minusBalance > 0) {
      router.post(route('updateBalance'), {
        user_id: selectedCenter.center.id,
        minusBalance: minusBalance,
      });
      setShowMinusBalanceModal(false);
      setMinusBalanceError(0);
      setMinusBalance(0);
    }
  }

  const handleAddBalanceFromUser = () => {
    router.post(route('requestBalance'), {
      user_id: selectedCenter.center.id,
    });
    setShowAddBalanceFromUserModal(false);
  }

  const handleCancleBalanceFromUser = () => {
    router.post(route('cancleBalance'), {
      user_id: selectedCenter.center.id,
    });
    setShowAddBalanceFromUserModal(false);
  }

  const handleSelectUser = (selectedUser) => {
    searchFieldChanged('user_id', selectedUser.id);
  };

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    queryParams.page = 1;
    router.get(route('center.balances.home'), queryParams);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }
    queryParams.page = 1;
    router.get(route('center.balances.home'), queryParams);
  };

  const colChanged = (name, value) => {
    queryParams[name] = value;
    queryParams.page = 1;
    router.get(route('center.balances.home'), queryParams)
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <MdOutlineAccountTree className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              أرصدة المراكز
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="أرصدة المراكز" />
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">إضافة دفعة للمركز  : {(selectedCenter && selectedCenter.center.name)}</h2>
          <p className="mt-4">أدخل الدفعة التي تم تسديديها من قبل المركز</p>
          <div>
            <TextInput
              type="number"
              className="mt-4"
              placeholder="المبلغ"
              min={0}
              value={add}
              onChange={(e) => setAdd(e.target.value)}
              lang="en"
            />
          </div>
          <InputError message={addError} className="mt-2" />
          <div>
            <TextInput
              className="mt-4"
              placeholder="البيان"
              value={statment}
              onChange={(e) => { setStatment(e.target.value) }}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAdd}
              type="button"
              className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              موافق
              <LuCheckCircle style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
            </button>
            <button
              onClick={() => (setShowAddModal(false), setAdd(0), setStatment(''), setAddError(''))}
              type="button"
              className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              إلغاء الأمر
              <MdOutlineCancel style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
            </button>
          </div>
        </div>
      </Modal>
      <Modal show={showAddBalanceModal} onClose={() => setShowAddBalanceModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900 bg-green-200/80">
          <h2 className="text-lg font-medium">تغذية رصيد للمركز  : {(selectedCenter && selectedCenter.center.name)}</h2>
          <p className="mt-4">أدخل الرصيد الذي تريد فتحه للمركز</p>
          <div>
            <TextInput
              type="number"
              className="mt-4"
              placeholder="الرصيد"
              min={0}
              value={addBalance}
              onChange={(e) => setAddBalance(e.target.value)}
              lang="en"
            />
          </div>
          <InputError message={addBalanceError} className="mt-2" />
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAddBalance}
              type="button"
              className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              موافق
              <LuCheckCircle style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
            </button>
            <button
              onClick={() => (setShowAddBalanceModal(false), setAddBalance(0), setAddBalanceError(''))}
              type="button"
              className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              إلغاء الأمر
              <MdOutlineCancel style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
            </button>
          </div>
        </div>
      </Modal>
      <Modal show={showMinusBalanceModal} onClose={() => setShowMinusBalanceModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900 bg-red-200/80">
          <h2 className="text-lg font-medium">سحب رصيد من المركز  : {(selectedCenter && selectedCenter.center.name)}</h2>
          <p className="mt-4">أدخل الرصيد الذي تريد سحبه من المركز</p>
          <div>
            <TextInput
              type="number"
              className="mt-4"
              placeholder="الرصيد"
              value={minusBalance}
              min={0}
              onChange={(e) => setMinusBalance(e.target.value)}
              lang="en"
            />
          </div>
          <InputError message={minusBalanceError} className="mt-2" />
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleMinusBalance}
              type="button"
              className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              موافق
              <LuCheckCircle style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
            </button>
            <button
              onClick={() => (setShowMinusBalanceModal(false), setMinusBalance(0), setMinusBalanceError(''))}
              type="button"
              className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              إلغاء الأمر
              <MdOutlineCancel style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
            </button>
          </div>
        </div>
      </Modal>
      <Modal show={showAddBalanceFromUserModal} onClose={() => setShowAddBalanceFromUserModal(false)} maxWidth="lg">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">تغذية رصيد للمركز  : {(selectedCenter && selectedCenter.center.name)}</h2>
          <p className="mt-4">طلب المركز تغذية رصيد بقيمة : {(selectedCenter && selectedCenter.center.add_balance)}</p>
          <p className="mt-4">يرجى معالجة الطلب بالقبول أو الرفض</p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAddBalanceFromUser}
              type="button"
              className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              قبول
              <LuCheckCircle style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
            </button>
            <button
              onClick={handleCancleBalanceFromUser}
              type="button"
              className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              رفض
              <MdOutlineCancel style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
            </button>
          </div>
        </div>
      </Modal>
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<SuccessMessage message={success} />)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-2 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200">
                  <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <TableHeading
                        sortable={false}
                      >
                        #
                      </TableHeading>
                      <TableHeading
                        name='name'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المركز
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        المدفوعات
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        الطلبات
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        الرصيد الصافي
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        الربح
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        الصلاحية
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        رصيد الواجهة
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        المسؤول
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        التفاصيل والتسديد النقدي
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        الصلاحية
                      </TableHeading>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <th className="py-3 text-center">
                        <SelectInput
                          className="text-sm font-medium"
                          defaultValue={queryParams.col}
                          onChange={e => colChanged('col', e.target.value)}
                        >
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="75">75</option>
                          <option value="100">100</option>
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3 relative">
                        <SearchableDropdown
                          items={usersMenu}
                          name="user_id"
                          selectedItem={users.data.find((user) => user.id === queryParams.user_id)}
                          onSelectItem={handleSelectUser}
                          placeholder="اختر المركز"
                          queryParams={queryParams}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {center_balances.data.map((center_balance, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={center_balance.center.id}>
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2">{center_balance.center.name}</td>
                        <td className="py-2">{center_balance.total_add.toLocaleString('en-US')}</td>
                        <td className="py-2">{center_balance.total_reduce.toLocaleString('en-US')}</td>
                        <td className={`py-2 text-white`}>
                          <span className={`${center_balance.final_balance_number < 0 ?
                            "min-w-[80px] inline-block bg-red-800 text-red-100 text-md font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300"
                            :
                            'min-w-[80px] inline-block bg-green-800 text-green-100 text-md font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'
                            }`
                          }
                          >
                            {center_balance.final_balance.toLocaleString('en-US')}
                          </span>
                        </td>
                        <td className="py-2">{center_balance.total_profit}</td>
                        <td className="py-2">
                          <span className="min-w-[80px] inline-block bg-red-800 text-red-100 text-md font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                            {center_balance.center.user_balance.toLocaleString('en-US')}
                          </span>
                        </td>
                        <td className="py-2">
                          <span className={`rounded-md px-3 min-w-[80px] text-center inline-block font-semibold border-2 border-blue-600`}>
                            {(center_balance.center.user_balance + center_balance.final_balance).toLocaleString('en-US')}
                          </span>
                        </td>
                        <td className="py-2 px-1 ">{center_balance.center.created_by.name}</td>
                        <td className="py-2 text-nowrap flex">
                          {/* {auth.user.id === center_balance.center.created_by.id ? ( */}
                          <>
                            {(center_balance.total_add === 0 && center_balance.total_reduce === 0) ?
                              (
                                <button
                                  disabled={true}
                                  onClick={() => openDetails(center_balance)}
                                  type="button"
                                  className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                                  التفاصيل
                                  <TbListDetails style={{ marginRight: '8px' }} size={25} />
                                </button>
                              )
                              : (
                                <button
                                  onClick={() => openDetails(center_balance)}
                                  type="button"
                                  className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                                  التفاصيل
                                  <TbListDetails style={{ marginRight: '8px' }} size={25} />
                                </button>
                              )}
                            <button
                              onClick={() => openAddModal(center_balance)}
                              type="button"
                              className="inline-flex text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                              تسديد نقدي
                              <GiMoneyStack style={{ marginRight: '8px' }} size={25} />
                            </button>
                          </>
                        </td>
                        <td className="px-1 py-2 text-nowrap">
                          {(center_balance.center.add_balance > 0) ? (
                            <button
                              onClick={() => openAddBalanceFromUserModal(center_balance)}
                              type="button"
                              className={buttonColor}>
                              معالجة الطلب
                              <TbProgress style={{ marginRight: '8px' }} size={25} />
                            </button>
                          ) : (
                            <>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => openAddBalanceModal(center_balance)}
                                  className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-lg px-5 py-1.5 text-center me-2">
                                  فتح
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openMinusBalanceModal(center_balance)}
                                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                                  سحب
                                </button>
                              </div>
                            </>
                          )}
                          {/* ) : (
                          <span className="font-medium text-gray-600 dark:text-gray-500 mx-1">ليس لديك صلاحيات</span>
                          )} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-center">
                    <tr>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">المجموع</th>
                      <th className="px-3 py-3">{total_add_all}</th>
                      <th className="px-3 py-3">{total_reduce_all}</th>
                      <th className="px-3 py-3">{final_balance_all}</th>
                      <th className="px-3 py-3">{total_profit_all}</th>
                      <th className="px-3 py-3">{total_user_balance_all}</th>
                    </tr>
                  </tfoot>
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
                  <Pagination links={center_balances.links} queryParams={queryParams} />
                </div>
                <div className="mt-4">
                  <h3>إجمالي السجلات : {center_balances.data.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
