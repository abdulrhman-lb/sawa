import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { ORDER_CLASS_MAP, ORDER_TEXT_MAP } from "@/constants";
import SearchableDropdown from "@/Components/SearchableDropdown";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import WarningMessage from "@/Components/WarningMessage";
import Title from "@/Components/Title";
import { FaBorderNone } from "react-icons/fa";
import { useState } from "react";
import CustomDatePicker from "@/Components/CustomDatePicker";
import { format, parse } from "date-fns";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";

export default function indexAll({
  auth,
  users,
  message,
  orders,
  queryParams = null,
  success = ['0', ''],
}) {

  queryParams = queryParams || {}

  const [selectedStartDate, setSelectedStartDate] = useState(
    (queryParams['start_date'] && parse(queryParams['start_date'], "dd/MM/yyyy", new Date())) || new Date()
  );

  const [selectedEndDate, setSelectedEndDate] = useState(
    (queryParams['end_date'] && parse(queryParams['end_date'], "dd/MM/yyyy", new Date())) || new Date()
  );



  const handleSelectUser = (selectedUser) => {
    searchFieldChanged('user_id', selectedUser.id);
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
    router.get(route('order.home'), queryParams)
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
    router.get(route('order.home'), queryParams)
  }

  const colChanged = (name, value) => {
    queryParams[name] = value;
    queryParams.page = 1;
    router.get(route('order.home'), queryParams)
  }

  const searchDateChanged = () => {
    queryParams['start_date'] = (selectedStartDate && format(selectedStartDate, "dd/MM/yyyy"));
    queryParams['end_date'] = (selectedEndDate && format(selectedEndDate, "dd/MM/yyyy"));
    router.get(route('order.home'), queryParams);
  };

  const backOrder = (order) => {
    if (!window.confirm('هل تريد بالتأكيد التراجع عن تنفيذ هذا الطلب ؟')) {
      return;
    }
    router.post(route('order.back', {'id': order.id}))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <FaBorderNone className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              الطلبات الكلية
            </Title>
            <div className="flex items-center">
              <h4 className="mx-2 my-auto text-base">من</h4>
              <div className="flex justify-between items-center">
                <CustomDatePicker
                  className="w-[90px] h-[40px] mt-1 text-sm"
                  selected={selectedStartDate}
                  onChange={(date) => setSelectedStartDate(date)}
                />
              </div>
              <h4 className="mx-2 my-auto text-base">إلى</h4>
              <div className="flex justify-between items-center">
                <CustomDatePicker
                  className="w-[90px] h-[40px] mt-1 text-sm"
                  selected={selectedEndDate}
                  onChange={(date) => setSelectedEndDate(date)}
                />
              </div>
              <SecondaryButton
                className="h-[40px] my-auto mx-2 mt-1"
                onClick={e => searchDateChanged()}
                disabled={!selectedStartDate && !selectedEndDate}
              >تصفية</SecondaryButton>
            </div>
          </ScrollBar>
        </div>
      }
    >
      <Head title="الطلبات الكلية" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            (success[0] === '0' ? (<SuccessMessage message={success[1]} />)
              : (<WarningMessage message={success[1]} />)
            )
          )
          }
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
                        التوقيت
                      </TableHeading>
                      <TableHeading
                        name='user_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المركز
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        تفاصيل الخدمة
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        السعر
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        عمولة
                      </TableHeading>
                      <TableHeading
                        sortable={false}
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
                      <TableHeading
                        sortable={false}
                      >
                        سبب الرفض
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >

                      </TableHeading>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <th className="py-1 text-center">
                        <SelectInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.col}
                          onChange={e => colChanged('col', e.target.value)}
                        >
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="75">75</option>
                          <option value="100">100</option>
                        </SelectInput>
                      </th>
                      <th className="px-1 py-2"></th>
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
                      <th className="px-3 py-3">
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
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {orders.data.map((order, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={order.id}>
                        <td className="px-1 py-2">{index + 1}</td>
                        <td className="px-2 py-2 text-nowrap">{order.created_at}</td>
                        <td className="px-2 py-2 text-nowrap">{order.time_created}</td>
                        <td className="px-1 py-2">{order.user.name}</td>
                        <td className="px-1 py-2 text-nowrap">{order.service.product.category.name}
                          <span className="text-red-500 px-2">|</span>
                          {order.service.product.name}
                          <span className="text-red-500 px-2">|</span>
                          {order.service.name}<br />
                          {order.amount_kind.kindName.name}
                          <span className="text-red-500 px-2">|</span>
                          {order.service.data_1.name}
                          <span className="text-red-500 px-2">|</span>
                          <span className="bg-red-400 text-white rounded-md px-3 min-w-[100px] text-center inline-block font-normal">{order.data_kind_1}</span>
                          {order.data_kind_2 && (`-  ${order.service.data_2.name}  |  ${order.data_kind_2}`)}
                        </td>
                        <td className="px-1 py-2">{order.amount}</td>
                        <td className="px-1 py-2">{order.comission_admin + order.comission_super} %</td>
                        <td className="px-1 py-2">{order.net}</td>
                        <td className="px-1 py-2 text-center">
                          <span className={"px-2 py-0 cursor-pointer rounded text-white text-nowrap " +
                            ORDER_CLASS_MAP[order.status]} >
                            {ORDER_TEXT_MAP[order.status]}
                          </span>
                        </td>
                        <td className="px-1 py-2 text-nowrap">{order.status === 'in_progress' ? '-' : order.time_updated}</td>
                        <td className="px-1 py-2">{order.reject_reson}</td>
                        <td className="px-1 py-2">
                          {(order.status === 'completed' && auth.user.kind === 'admin') && (
                            <button
                              type="button"
                              onClick={() => backOrder(order)}
                              className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                              حذف
                              <MdOutlineSettingsBackupRestore style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
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
                  <Pagination links={orders.meta.links} queryParams={queryParams} />
                </div>
                <div className="mt-4">
                  <h3>إجمالي السجلات : {orders.data.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
