import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useState } from "react";
import SearchableDropdown from "@/Components/SearchableDropdown";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import DetailsButton from "@/Components/Buttons/DetailsButton";
import AddButton from "@/Components/Buttons/AddButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import RejectButton from "@/Components/Buttons/RejectButton copy";

export default function index({
  auth,
  center_balances,
  users,
  total_add_all,
  total_reduce_all,
  total_profit_all,
  final_balance_all,
  remainingBalanceCenter,
  queryParams = null,
  success }) {

  const [showAddModal, setShowAddModal] = useState(false);
  const [showReduceModal, setShowReduceModal] = useState(false);
  const [showAddCapciteModal, setShowAddCapciteModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [add, setAdd] = useState(0);
  const [addCapcite, setAddCapcite] = useState(0);
  const [reduce, setReduce] = useState(0);
  const [addError, setAddError] = useState('');
  const [reduceError, setReduceError] = useState('');
  const [balanceError, setBalanceError] = useState('');
  const [capciteError, setCapciteError] = useState('');

  queryParams = queryParams || {}

  const adminsMenu = users.data.filter((center) => center.kind != "user");
  const usersMenu = users.data.filter((center) => center.kind != "admin");

  const openAddModal = (center_balance) => {
    setSelectedCenter(center_balance);
    setShowAddModal(true);
  }

  const openReduceModal = (center_balance) => {
    setSelectedCenter(center_balance);
    setShowReduceModal(true);
  }

  const openAddCapciteModal = () => {
    setShowAddCapciteModal(true);
  }

  const openDetails = (center_balance) => {
    router.get(route('center-balance-virtual.index', { center_id: center_balance.center.id }));
  }

  const handleAdd = () => {
    if (add <= 0) {
      setAddError('القيمة يجب أن تكون أكبر من الصفر');
    } else {
      setAddError('');
    }
    if (remainingBalanceCenter >= add) {
      if (add > 0) {
        router.post(route('center-balance-virtual.store'), {
          user_id: selectedCenter.center.id,
          add: add,
          reduce: 0,
          statment: 'تغذية رصيد للمركز: ' + selectedCenter.center.name + ' من قبل ' + auth.user.name,
          status: 1
        });
        setShowAddModal(false);
        setAdd(0);
        setAddError(0);
      }
    } else {
      setShowAddModal(false);
      setBalanceError('ليس لديك رصيد كافي لتوزيعه على المراكز');
    }
  }

  const handleReduce = () => {
    if (reduce <= 0) {
      setReduceError('القيمة يجب أن تكون أكبر من الصفر');
    } else {
      if (reduce > selectedCenter.final_balance_number) {
        setReduceError('يجب أن تكون القيمة المدخلة أصفر أو تساوي : ' + selectedCenter.final_balance);
      } else {
        setAddError('');
      }
    }
    if ((reduce > 0) && (reduce <= selectedCenter.final_balance_number)) {
      router.post(route('center-balance-virtual.store'), {
        user_id: selectedCenter.center.id,
        add: 0,
        reduce: reduce,
        statment: 'سحب رصيد من المركز : ' + selectedCenter.center.name + ' من قبل ' + auth.user.name,
        status: 0
      });
      setShowReduceModal(false);
      setReduce(0);
      setReduceError(0);
    }
  }

  const handleAddCapcite = () => {
    if (addCapcite <= 0) {
      setCapciteError('القيمة يجب أن تكون أكبر من الصفر');
    } else {
      setCapciteError('');
    }
    if (addCapcite > 0) {
      router.post(route('center-balance-virtual.store'), {
        user_id: auth.user.id,
        add: addCapcite,
        reduce: 0,
        statment: 'إضافة رصيد للبرنامج',
        status: 2
      });
      setShowAddCapciteModal(false);
      setAddCapcite(0);
      setCapciteError(0);
    }
  }

  const handleSelectUser = (selectedUser) => {
    searchFieldChanged('user_id', selectedUser.id);
  };

  const handleSelectAdmin = (selectedadmin) => {
    searchFieldChanged('officerId', selectedadmin.id);
  };

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    queryParams.page = 1;
    router.get(route('center.balances.virtual.home'), queryParams);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }
    queryParams.page = 1;
    router.get(route('center.balances.virtual.home'), queryParams);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            أرصدة المراكز
          </h2>
          {auth.user.kind === 'admin' && <AddButton onClick={e => openAddCapciteModal()}>إضافة</AddButton>}
        </div>
      }
    >
      <Head title="أرصدة المراكز" />

      <Modal show={showAddCapciteModal} onClose={() => setShowAddCapciteModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">إضافة رصيد لمدير النظام</h2>
          <p className="mt-4">أدخل الرصيد الذي تريد إضافته </p>
          <div>
            <TextInput
              type="number"
              className="mt-4"
              placeholder="الرصيد"
              value={addCapcite}
              onChange={(e) => setAddCapcite(e.target.value)}
            />
          </div>
          <InputError message={capciteError} className="mt-2" />
          <div className="mt-6 flex justify-end">
            <button onClick={handleAddCapcite} className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
            <button onClick={() => (setShowAddCapciteModal(false), setAddCapcite(0), setCapciteError(''))} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200">إلغاء</button>
          </div>
        </div>
      </Modal>

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">إضافة رصيد للمركز  : {(selectedCenter && selectedCenter.center.name)}</h2>
          <p className="mt-4">أدخل الرصيد الذي تريد إضافته للمركز</p>
          <div>
            <TextInput
              type="number"
              className="mt-4"
              placeholder="الرصيد"
              value={add}
              onChange={(e) => setAdd(e.target.value)}
            />
          </div>
          <InputError message={addError} className="mt-2" />
          <div className="mt-6 flex justify-end">
            <button onClick={handleAdd} className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
            <button onClick={() => (setShowAddModal(false), setAdd(0), setAddError(''))} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200">إلغاء</button>
          </div>
        </div>
      </Modal>

      <Modal show={showReduceModal} onClose={() => setShowReduceModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">سحب رصيد من المركز  : {(selectedCenter && selectedCenter.center.name)}</h2>
          <h2 className="text-lg font-medium">الرصيد الحالي: {(selectedCenter && selectedCenter.final_balance)}</h2>
          <p className="mt-4">أدخل الرصيد الذي تريد سحبه من المركز</p>
          <div>
            <TextInput
              type="number"
              className="mt-4"
              placeholder="الرصيد"
              value={reduce}
              onChange={(e) => setReduce(e.target.value)}
            />
          </div>
          <InputError message={reduceError} className="mt-2" />
          {/* <div>
            <TextInput
              className="mt-4"
              placeholder="البيان"
              value={statment}
              onChange={(e) => { setStatment(e.target.value) }}
            />
          </div>
          <InputError message={statmentError} className="mt-2" /> */}
          <div className="mt-6 flex justify-end">
            <button onClick={handleReduce} className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
            <button onClick={() => (setShowReduceModal(false), setReduce(0), setReduceError(''))} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200">إلغاء</button>
          </div>
        </div>
      </Modal>
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
            {success}
          </div>)}
          {balanceError && (<div className="bg-red-500 py-2 px-4 text-white rounded mb-4">
            {balanceError}
          </div>)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200">
                  <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      {/* <TableHeading
                        name='id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        ID
                      </TableHeading> */}
                      <TableHeading
                        name='center.name'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المركز
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        تعبئة رصيد
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        السحب
                      </TableHeading>
                      <TableHeading
                        name='final_balance'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        الرصيد الصافي
                      </TableHeading>
                      <TableHeading
                        name='category'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المسؤول
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
                      {/* <th className="px-3 py-3"></th> */}
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
                      {auth.user.kind === 'admin' ? (
                        <th className="px-3 py-3 relative">
                          <SearchableDropdown
                            items={adminsMenu}
                            name="officer_id"
                            selectedItem={users.data.find((admin) => admin.id == queryParams.officerId)}
                            onSelectItem={handleSelectAdmin}
                            placeholder="اختر المسؤول"
                            queryParams={queryParams}
                          />
                        </th>
                      ) : (
                        <th className="px-3 py-3"></th>
                      )}
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {center_balances.data.map((center_balance) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={center_balance.center.id}>
                        {/* <td className="px-3 py-2">{center_balance.center.id}</td> */}
                        <td className="px-3 py-2">{center_balance.center.name}</td>
                        <td className="px-3 py-2">{center_balance.total_add}</td>
                        <td className="px-3 py-2">{center_balance.total_reduce}</td>
                        {/* <td className={`px-3 py-2 ${center_balance.final_balance_number < 0 ? "text-red-500" : 'text-green-500'}`}>{center_balance.final_balance}</td> */}
                        <td className={`px-3 py-2 text-white`}>
                          <span className={`${center_balance.final_balance_number < 0 ? "bg-red-600" : 'bg-emerald-600'} rounded-md px-3 min-w-[100px] text-center inline-block font-normal`}>{center_balance.final_balance}</span>
                        </td>
                        <td className="px-3 py-2">{center_balance.center.created_by.name}</td>
                        <td className="px-3 py-2 text-nowrap">
                          {auth.user.id === center_balance.center.created_by.id ? (
                            <>
                              <DetailsButton onClick={() => openDetails(center_balance)} className="">عرض التفاصيل</DetailsButton>
                              {center_balance.center.kind != "admin" ? (
                                <>
                                  <AddButton onClick={() => openAddModal(center_balance)}>تغذية رصيد</AddButton>
                                  <RejectButton onClick={() => openReduceModal(center_balance)}>سحب رصيد</RejectButton>
                                </>
                              ) : (
                                <>
                                  <AddButton disabled={true} onClick={() => openAddModal(center_balance)}>تغذية رصيد</AddButton>
                                  <RejectButton disabled={true} onClick={() => openReduceModal(center_balance)}>سحب رصيد</RejectButton>
                                </>
                              )}
                            </>
                          ) : (
                            <span className="font-medium text-gray-600 dark:text-gray-500 mx-1">ليس لديك صلاحيات</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-center">
                    <tr>
                      {/* <th className="px-3 py-3"></th> */}
                      <th className="px-3 py-3">المجموع</th>
                      <th className="px-3 py-3">{total_add_all}</th>
                      <th className="px-3 py-3">{total_reduce_all}</th>
                      <th className="px-3 py-3">{final_balance_all}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <Pagination links={center_balances.links} queryParams={queryParams} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
