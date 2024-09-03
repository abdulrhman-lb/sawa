import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useState } from "react";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import ExportToExcelButton from "@/Components/ExportToExcelButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DeleteButton from "@/Components/Buttons/DeleteButton";

export default function index({
  auth,
  center_balance,
  total_add_all,
  total_reduce_all,
  total_profit_all,
  final_balance_all,
  final_balance_all_test,
  queryParams = null,
  success }) {

  queryParams = queryParams || {}
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [add, setAdd] = useState(0);
  const [statment, setStatment] = useState(null);

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
  const editCenterBalance = (center_balance) => {
    setSelectedCenter(center_balance);
    setAdd(center_balance.add);
    setStatment(center_balance.statment);
    setShowEditModal(true);
  }

  const handleEdit = () => {
    router.post(route('center-balance-virtual.update', selectedCenter), {
      user_id: selectedCenter.user.id,
      add: add,
      statment: statment,
      _method: 'PUT'
    });
    setShowEditModal(false);
    setStatment('');
    setAdd(0);
  }


  const deleteCenterBalance = (center_balance) => {
    if (!window.confirm('هل تريد بالتأكيد حذف تغذية الرصيد المحددة ؟')) {
      return;
    }
    router.delete(route('center-balance-virtual.destroy', center_balance.id))
  }

  // إعداد الأعمدة التي سيتم تصديرها إلى Excel
  const columns = {
    created_at: "التاريخ",
    add: "المبلغ المضاف",
    reduce: "المبلغ المخصوم",
    statment: "البيان",
    details: "التفاصيل" // هذا يمثل التفاصيل المعقدة
  };

  // إعداد البيانات التي سيتم تصديرها إلى Excel
  const exportData = center_balance.data.map((balance) => ({
    created_at: balance.created_at,
    add: balance.add.toLocaleString(),
    reduce: balance.reduce.toLocaleString(),
    statment: balance.statment,
    details: balance.order
      ? `${balance.order.user.name} / ${balance.order.service.name} / ${balance.order.amount_kind.kindName.name}`
      : '-',
  }));
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            حركة رصيد للمركز : {center_balance.data[0].user.name}
          </h2>
          <ExportToExcelButton
            data={exportData}
            columns={columns}
            fileName={`حركة رصيد للمركز : ${center_balance.data[0].user.name}`}
            total_add_all={total_add_all}
            total_reduce_all={total_reduce_all}
            final_balance_all={final_balance_all}
          />
        </div>
      }
    >
      <Head title="حركة رصيد مركز" />

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">تعديل حركة تغذية رصيد : {(selectedCenter && selectedCenter.user.name)}</h2>
          <p className="mt-4">يمكنك تعديل القيمة أو البيان فقط</p>
          <div>
            <TextInput
              type="number"
              className="mt-4"
              placeholder="الرصيد"
              value={add}
              onChange={(e) => setAdd(e.target.value)}
            />
          </div>
          <div>
            <TextInput
              className="mt-4"
              placeholder="البيان"
              value={statment}
              onChange={(e) => setStatment(e.target.value)}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleEdit} className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
            <button onClick={() => (setShowEditModal(false), setAdd(0), setStatment(''))} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200">إلغاء</button>
          </div>
        </div>
      </Modal>

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
            {success}
          </div>)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200">
                  <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <TableHeading
                        name='id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        التاريخ
                      </TableHeading>
                      <TableHeading
                        name='category'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        حركات تغذية الرصيد
                      </TableHeading>
                      <TableHeading
                        name='center.name'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        حركات السحب
                      </TableHeading>
                      <TableHeading
                        name='total_reduce'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        البيان
                      </TableHeading>
                      <TableHeading
                        name='final_balance'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        التفاصيل
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        التحكم
                      </TableHeading>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {center_balance.data.map((center_balanc) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={center_balanc.id}>
                        <td className="px-3 py-2">{center_balanc.created_at}</td>
                        <td className="px-3 py-2">{center_balanc.add.toLocaleString()}</td>
                        <td className="px-3 py-2">{center_balanc.reduce.toLocaleString()}</td>
                        <td className="px-3 py-2">{center_balanc.statment}</td>
                        <td className="px-3 py-2">{center_balanc.order ? (center_balanc.order.user.name + " / " + center_balanc.order.service.name + " / " + center_balanc.order.amount_kind.kindName.name) : '-'}</td>
                        <td className="px-3 py-2 text-nowrap">
                          {!center_balanc.order ? (
                            <>
                              <PrimaryButton onClick={() => editCenterBalance(center_balanc)}>تعديل</PrimaryButton>
                              <DeleteButton onClick={e => deleteCenterBalance(center_balanc)}>حذف</DeleteButton>
                            </>
                          ) : (
                            <span className="font-medium text-gray-600 dark:text-gray-500 mx-1">لا يمكن التعديل</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-center">
                    <tr>
                      <th className="px-3 py-3">المجموع</th>
                      <th className="px-3 py-3">{total_add_all}</th>
                      <th className="px-3 py-3">{total_reduce_all}</th>
                      <th className={`px-3 py-2 ${final_balance_all_test < 0 ? "text-red-500" : 'text-green-500'}`}>الرصيد النهائي للمركز : {final_balance_all}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <Pagination links={center_balance.meta.links} queryParams={queryParams} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}