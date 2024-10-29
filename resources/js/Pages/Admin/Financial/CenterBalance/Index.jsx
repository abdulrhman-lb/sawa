import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useState } from "react";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import { MdOutlineAccountTree, MdOutlineCancel } from "react-icons/md";
import SelectInput from "@/Components/SelectInput";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { LuCheckCircle } from "react-icons/lu";

export default function index({
  auth,
  center_balance,
  total_add_all,
  total_reduce_all,
  total_profit_all,
  final_balance_all,
  final_balance_all_test,
  center_balance_vir,
  total_add_all_vir,
  total_reduce_all_vir,
  final_balance_all_vir,
  queryParams = null,
  message,
  success,
  
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
            <button
              onClick={handleEdit}
              type="button"
              className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              موافق
              <LuCheckCircle style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
            </button>
            <button
              onClick={() => (setShowEditModal(false), setAdd(0), setStatment(''))}
              type="button"
              className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              إلغاء الأمر
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
                    {center_balance.data.map((center_balanc, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={center_balanc.id}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{center_balanc.created_at}</td>
                        <td className="px-3 py-2">{center_balanc.add.toLocaleString('en-US')}</td>
                        <td className="px-3 py-2">{center_balanc.reduce.toLocaleString('en-US')}</td>
                        <td className="px-3 py-2">{center_balanc.profit.toLocaleString('en-US')}</td>
                        <td className="px-3 py-2">{center_balanc.statment}</td>
                        <td className="px-3 py-2">{center_balanc.order ? (
                          <>
                            {center_balanc.order.user.name}
                            <span className="text-red-500 px-1">|</span>
                            {center_balanc.order.service.product.name}
                            <span className="text-red-500 px-1">|</span>
                            {center_balanc.order.service.name}
                            <span className="text-red-500 px-1">|</span>
                            {center_balanc.order.amount_kind.kindName.name}
                            <span className="text-red-500 px-1">| الرقم</span>
                            {center_balanc.order.data_kind_1}
                          </>
                        ) : '-'}
                        </td>
                        <td className="px-3 py-2 text-nowrap flex justify-center">
                          {(!center_balanc.order && center_balanc.user_id != auth.user.id) ? (
                            <>
                              <button
                                onClick={() => editCenterBalance(center_balanc)}
                                type="button"
                                className="inline-flex text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                                تعديل
                                <FaRegEdit style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                              </button>
                              <button
                                type="button"
                                onClick={e => deleteCenterBalance(center_balanc)}
                                className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                                حذف
                                <RiDeleteBin6Line style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
                              </button>
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
                      <th colSpan="2" className={`px-3 py-2 pr-2 text-right ${final_balance_all_test < 0 ? "text-red-500" : 'text-green-500'}`}>الرصيد المالي : {final_balance_all}</th>
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
            {/* جدول الارصدة */}
            <div className="p-2 text-gray-900 dark:text-gray-100">
              <h1 className="py-4 font-semibold text-center bg-emerald-700 rounded-md text-white text-xl my-4">جدول حركة الارصدة</h1>
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
                        الوقت
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        إضافة إلى الرصيد
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        سحب من الرصيد
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        البيان
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
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {center_balance_vir.data.map((center_balanc, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={center_balanc.id}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{center_balanc.created_at}</td>
                        <td className="px-3 py-2">{center_balanc.time}</td>
                        <td className="px-3 py-2">{center_balanc.add.toLocaleString('en-US')}</td>
                        <td className="px-3 py-2">{center_balanc.reduce.toLocaleString('en-US')}</td>
                        <td className="px-3 py-2">{center_balanc.statment}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-center bg-gray-50">
                    <tr>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">المجموع</th>
                      <th className="px-3 py-3">{total_add_all_vir}</th>
                      <th className="px-3 py-3">{total_reduce_all_vir}</th>
                      <th className={`px-3 py-2 pr-2`}>الرصيد : {final_balance_all_vir}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="flex px-4">
                <SelectInput
                  className="text-sm font-medium mt-4"
                  defaultValue={queryParams.colBalance}
                  onChange={e => colChanged('colBalance', e.target.value)}
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                  <option value="100">100</option>
                </SelectInput>
                <div className="flex mx-auto">
                  <Pagination links={center_balance_vir.meta.links} queryParams={queryParams} />
                </div>
                <div className="mt-4">
                  <h3>إجمالي السجلات : {center_balance_vir.data.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
