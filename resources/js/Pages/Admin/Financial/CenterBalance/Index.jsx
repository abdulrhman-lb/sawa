import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useState } from "react";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DeleteButton from "@/Components/Buttons/DeleteButton";
import AcceptButton from "@/Components/Buttons/AcceptButton";
import RejectButton from "@/Components/Buttons/RejectButton copy";
import InputError from "@/Components/InputError";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import { MdOutlineAccountTree } from "react-icons/md";
import SelectInput from "@/Components/SelectInput";

export default function index({
  auth,
  center_balance,
  total_add_all,
  total_reduce_all,
  total_profit_all,
  final_balance_all,
  final_balance_all_test,
  queryParams = null,
  message,
  success,
  initialNotifications
}) {

  queryParams = queryParams || {}

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [add, setAdd] = useState(0);
  const [statment, setStatment] = useState(null);
  const [addError, setAddError] = useState('');

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'desc';
    }
    queryParams['center_id'] = center_balance.data[0].user_id
    queryParams.page = 1;
    router.get(route('center-balance.index'), queryParams);
  };

  const colChanged = (name, value) => {
    queryParams[name] = value;
    queryParams['center_id'] = center_balance.data[0].user_id;
    queryParams.page = 1;
    router.get(route('center-balance.index'), queryParams)
  }

  const editCenterBalance = (center_balance) => {
    setSelectedCenter(center_balance);
    setAdd(center_balance.add);
    setStatment(center_balance.statment);
    setShowEditModal(true);
  }

  const handleEdit = () => {
    if (add <= 0) {
      setAddError('القيمة يجب أن تكون أكبر من الصفر');
    } else {
      setAddError('');
    }
    if ((add > 0)) {
      router.post(route('center-balance.update', selectedCenter), {
        user_id: selectedCenter.user.id,
        add: add,
        statment: statment || '-',
        _method: 'PUT'
      });
      setShowEditModal(false);
      setStatment('');
      setAdd(0);
      setAddError(0);
    }
  }

  const deleteCenterBalance = (center_balance) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذا الايداع ؟')) {
      return;
    }
    router.post(route('center-balance.destroy', center_balance.id), {
      _method: 'DELETE',
    })
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      notification={initialNotifications}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <MdOutlineAccountTree className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              حركة رصيد المركز : {center_balance.data[0].user.name}
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="حركة رصيد مركز" />
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">تعديل حركة ايداع رصيد : {(selectedCenter && selectedCenter.user.name)}</h2>
          <p className="mt-4">يمكنك تعديل القيمة أو البيان فقط</p>
          <div>
            <TextInput
              type="number"
              className="mt-4"
              placeholder="المبلغ"
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
              onChange={(e) => setStatment(e.target.value)}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <AcceptButton onClick={handleEdit}>موافق</AcceptButton>
            <RejectButton onClick={() => (setShowEditModal(false), setAdd(0), setStatment(''))}>إلغاء</RejectButton>
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
                        name='created_at'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        التاريخ
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        حركات الايداع
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        حركات السحب
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        الربح
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        البيان
                      </TableHeading>
                      <TableHeading
                        sortable={false}
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
                    {center_balance.data.map((center_balanc, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={center_balanc.id}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{center_balanc.created_at}</td>
                        <td className="px-3 py-2">{center_balanc.add.toLocaleString('en-US')}</td>
                        <td className="px-3 py-2">{center_balanc.reduce.toLocaleString('en-US')}</td>
                        <td className="px-3 py-2">{center_balanc.profit.toLocaleString('en-US')}</td>
                        <td className="px-3 py-2">{center_balanc.statment}</td>
                        <td className="px-3 py-2">{center_balanc.order ? (center_balanc.order.user.name + " / " + center_balanc.order.service.name + " / " + center_balanc.order.amount_kind.kindName.name + " / الرقم " + center_balanc.order.data_kind_1) : '-'}</td>
                        <td className="px-3 py-2 text-nowrap">
                          {(!center_balanc.order && center_balanc.user_id != auth.user.id) ? (
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
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">المجموع</th>
                      <th className="px-3 py-3">{total_add_all}</th>
                      <th className="px-3 py-3">{total_reduce_all}</th>
                      <th className="px-3 py-3">{total_profit_all}</th>
                      <th className={`px-3 py-2 ${final_balance_all_test < 0 ? "text-red-500" : 'text-green-500'}`}>الرصيد الفعلي النهائي للمركز : {final_balance_all}</th>
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
                  <Pagination links={center_balance.meta.links} queryParams={queryParams} />
                </div>
                <div className="mt-4">
                  <h3>إجمالي السجلات : {center_balance.data.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
