import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { KIND_DATA_TEXT_MAP, ORDER_CLASS_MAP, ORDER_TEXT_MAP, STATUS_CLASS_MAP, STATUS_TEXT_MAP } from "@/constants";
import { useState } from "react";
import SearchableDropdown from "@/Components/SearchableDropdown";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DeleteButton from "@/Components/Buttons/DeleteButton";
import RejectButton from "@/Components/Buttons/RejectButton copy";
import AcceptButton from "@/Components/Buttons/AcceptButton";

export default function index({ auth, users, customers, orders, queryParams = null, success = ['0', ''] }) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  queryParams = queryParams || {}


  const openApproveModal = (order) => {
    setSelectedOrder(order);
    setShowApproveModal(true);
  }

  const openRejectModal = (order) => {
    setSelectedOrder(order);
    setShowRejectModal(true);
  }

  const handleApprove = () => {
    console.log(selectedOrder);
    router.post(route('order.update', selectedOrder.id), {
      status: 'completed',
      _method: 'PUT'
    });
    setShowApproveModal(false);
  }

  const handleReject = () => {
    router.post(route('order.update', selectedOrder.id), {
      status: 'reject',
      reject_reson: rejectReason,
      _method: 'PUT'
    });
    setShowRejectModal(false);
  }

  const handleSelectUser = (selectedUser) => {
    searchFieldChanged('user_id', selectedUser.id);
  };

  const handleSelectCustomer = (selectedCustomer) => {
    searchFieldChanged('customer_id', selectedCustomer.id);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== 'Enter') return;
    searchFieldChanged(name, e.target.value);
  }

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    queryParams.page = 1;
    router.get(route('order.index'), queryParams)
  }

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === 'asc') {
        queryParams.sort_direction = 'desc';
      } else {
        queryParams.sort_direction = 'asc';
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }
    queryParams.page = 1;
    router.get(route('order.index'), queryParams)
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            الطلبات قيد المعالجة
          </h2>
        </div>
      }
    >
      <Head title="الطلبات قيد المعالجة" />
      {/* Approve Modal */}
      <Modal show={showApproveModal} onClose={() => setShowApproveModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">تأكيد الموافقة</h2>
          <p className="mt-4">هل أنت متأكد أنك تريد الموافقة على هذا الطلب؟</p>
          <div className="mt-6 flex justify-end">
            <button onClick={handleApprove} className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
            <button onClick={() => setShowApproveModal(false)} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200">إلغاء</button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onClose={() => setShowRejectModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">تأكيد الرفض</h2>
          <p className="mt-4">هل أنت متأكد أنك تريد رفض هذا الطلب؟</p>
          <TextInput
            className="mt-4"
            placeholder="سبب الرفض"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="mt-6 flex justify-end">
            <button onClick={handleReject} className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
            <button onClick={() => setShowRejectModal(false)} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200">إلغاء</button>
          </div>
        </div>
      </Modal>

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            (success[0] === '0' ? (
              <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                {success[1]}
              </div>)
              : (
                <div className="bg-red-500 py-2 px-4 text-white rounded mb-4">
                  {success[1]}
                </div>
              )
            )
          )
          }

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200">
                  <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <TableHeading
                        name='created_at'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        التاريخ
                      </TableHeading>
                      <TableHeading
                        name='user_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المركز
                      </TableHeading>
                      {/* <TableHeading
                        name='customer_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        الزبون
                      </TableHeading> */}
                      <TableHeading
                        name='amount_kind'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        تفاصيل الخدمة
                      </TableHeading>
                      <TableHeading
                        name='amount'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        السعر
                      </TableHeading>
                      <TableHeading
                        name='comission'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        العمولة
                      </TableHeading>
                      <TableHeading
                        name='net'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        الصافي
                      </TableHeading>
                      <TableHeading
                        name='status'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        الحالة
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        المعالجة
                      </TableHeading>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3 relative">
                        <SearchableDropdown
                          items={users.data}
                          name="user_id"
                          selectedItem={users.data.find((user) => user.id === queryParams.user_id)}
                          onSelectItem={handleSelectUser}
                          placeholder="اختر المركز"
                          queryParams={queryParams}
                        />
                      </th>
                      {/* <th className="px-3 py-3 relative">
                        <SearchableDropdown
                          items={customers.data}
                          name="customer_id"
                          selectedItem={customers.data.find((customer) => customer.id === queryParams.customer_id)}
                          onSelectItem={handleSelectCustomer}
                          placeholder="اختر الزيون"
                          queryParams={queryParams}
                        />
                      </th> */}
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.data_kind_1}
                          placeholder="بيان الخدمة"
                          onBlur={e => searchFieldChanged('data_kind_1', e.target.value)}
                          onKeyPress={e => onKeyPress('data_kind_1', e)}
                        >
                        </TextInput>
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      {/* <th className="px-3 py-3">
                        <SelectInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.status}
                          onChange={e => searchFieldChanged('status', e.target.value)}
                        >
                          <option value="">اختر الحالة</option>
                          <option value="in_progress">قيد المعالجة </option>
                          <option value="completed">مقبول</option>
                          <option value="reject">مرفوض</option>
                        </SelectInput>
                      </th> */}
                      <th className="px-3 py-3"></th>

                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {orders.data.map((order) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={order.id}>
                        <td className="px-3 py-2 text-nowrap">{order.created_at}</td>
                        <td className="px-3 py-2">{order.user.name}</td>
                        {/* <td className="px-3 py-2">{order.customer.name}</td> */}
                        <td className="px-3 py-2 text-nowrap">{order.service.product.category.name} /
                          {order.service.product.name} /
                          {order.service.name} /
                          {order.amount_kind.kindName.name} <br />
                          {order.service.data_1.name} : {order.data_kind_1}
                          {order.data_kind_2 && (`-  ${order.service.data_2.name}  :  ${order.data_kind_2}`)}
                        </td>
                        <td className="px-3 py-2">{order.amount}</td>
                        <td className="px-3 py-2">{order.comission_admin + order.comission_super} %</td>
                        <td className="px-3 py-2">{order.net}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={"px-2 py-0 cursor-pointer rounded text-white text-nowrap " +
                            ORDER_CLASS_MAP[order.status]} >
                            {ORDER_TEXT_MAP[order.status]}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-nowrap">
                          {(order.user.created_by == auth.user.id || order.user_id === auth.user.id) ? (
                            <>
                              <AcceptButton onClick={() => openApproveModal(order)}>موافق</AcceptButton>
                              <RejectButton onClick={() => openRejectModal(order)}>رفض</RejectButton>
                            </>
                          ) : (
                            <span className="font-medium text-gray-600 dark:text-gray-500 mx-1">المركز تابع لتاجر</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={orders.meta.links} queryParams={queryParams} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
