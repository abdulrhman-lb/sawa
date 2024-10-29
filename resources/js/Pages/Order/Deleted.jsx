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
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

export default function indexAll({
  auth,
  users,
  message,
  orders,
  queryParams = null,
  success = ['0', ''],
}) {

  queryParams = queryParams || {}

  const [selectedDate, setSelectedDate] = useState(
    (queryParams['date'] && parse(queryParams['date'], "dd/MM/yyyy", new Date())) || new Date()
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

  const searchDateChanged = (date) => {
    queryParams['date'] = (date && format(date, "dd/MM/yyyy"));
    console.log(queryParams['date']);
    router.get(route('order.home'), queryParams);
  };

  const backOrder = (order) => {
    console.log(order)
    if (!window.confirm('هل تريد بالتأكيد التراجع عن تنفيذ هذا الطلب ؟')) {
      return;
    }
    router.post(route('order.back', order))
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
              الطلبات المحذوفة
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="الطلبات المحذوفة" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                        تاريخ
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        توقيت الحذف
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
                        العمولة
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        الصافي
                      </TableHeading>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <th className="py-1 text-center">
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
                      <th className="px-1 py-2 text-center">
                        <div className="flex justify-center items-center">
                          <CustomDatePicker
                            className="w-[90px] h-[38px] mt-1 text-sm"
                            selected={selectedDate}
                            onChange={(date) => searchDateChanged(date)}
                          />
                        </div>
                      </th>
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
                          {order.service.name}
                          <span className="text-red-500 px-2">|</span>
                          {order.amount_kind.kindName.name} <br />
                          {order.service.data_1.name}
                          <span className="text-red-500 px-2">|</span>
                          <span className="bg-red-400 text-white rounded-md px-3 min-w-[125px] text-center inline-block font-normal">{order.data_kind_1}</span>
                          {order.data_kind_2 && (`-  ${order.service.data_2.name}  |  ${order.data_kind_2}`)}
                        </td>
                        <td className="px-1 py-2">{order.amount}</td>
                        <td className="px-1 py-2">{order.comission_admin + order.comission_super} %</td>
                        <td className="px-1 py-2">{order.net}</td>
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
