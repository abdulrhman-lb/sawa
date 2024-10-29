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
import CustomDatePicker from "@/Components/CustomDatePicker";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import SearchableDropdown from "@/Components/SearchableDropdown";
import SearchableDropdownCustomer from "@/Components/SearchableDropdownCustomer";
import SearchableDropdownCenter from "@/Components/SearchableDropdownCenter";
import { format, parse } from "date-fns";

export default function index({
  auth,
  queryParams = null,
  message,
  success,
  users,
  admins,
  products,
  center_balances,
  total_reduce_all,
  total_profit_all,
  max_reduce,
  max_profit,
}) {
  queryParams = queryParams || {}

  const [selectedStartDate, setSelectedStartDate] = useState(
    (queryParams['start_date'] && parse(queryParams['start_date'], "dd/MM/yyyy", new Date())) || new Date()
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    (queryParams['end_date'] && parse(queryParams['end_date'], "dd/MM/yyyy", new Date())) || new Date()
  );
  const [selectedUser, setSelectedUser] = useState(queryParams['user_id'] || null);
  const [selectedAdmin, setSelectedAdmin] = useState(queryParams['admin_id'] || auth.user.id || null);
  const [selectedProduct, setSelectedProduct] = useState(queryParams['product_id'] || null);
  const [selectedOrder, setSelectedOrder] = useState(queryParams['order'] || null);

  const searchDataChanged = () => {
    queryParams['start_date'] = (selectedStartDate && format(selectedStartDate, "dd/MM/yyyy"));
    queryParams['end_date'] = (selectedEndDate && format(selectedEndDate, "dd/MM/yyyy"));
    queryParams['user_id'] = selectedUser;
    queryParams['admin_id'] = selectedAdmin;
    queryParams['product_id'] = selectedProduct;
    queryParams['order'] = selectedOrder;
    router.get(route('center.balances.profit'), queryParams);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <div className="flex items-center">
              <h4 className="mx-2 my-auto text-sm text-nowrap">مركز بيع عادي</h4>
              <SearchableDropdownCenter
                items={users.data}
                name="user_id"
                placeholder=""
                className="w-full border text-sm border-red-800 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                selectedItem={users.data.find((user) => user.id == selectedUser)}
                change={(date) => setSelectedUser(date)}
              />
              <h4 className="mx-2 my-auto text-sm text-nowrap">تاجر مميز</h4>
              <SearchableDropdownCenter
                items={admins.data}
                name="admin_id"
                placeholder=""
                className="w-full border text-sm border-red-800 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                selectedItem={admins.data.find((admin) => admin.id == selectedAdmin)}
                change={(date) => setSelectedAdmin(date)}
              />
              <h4 className="mx-2 my-auto text-sm text-nowrap">المنتج</h4>
              <SearchableDropdownCenter
                items={products.data}
                name="product_id"
                placeholder=""
                className="w-full border text-sm border-red-800 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                selectedItem={products.data.find((product) => product.id == selectedProduct)}
                change={(date) => setSelectedProduct(date)}
              />
              <h4 className="mx-2 my-auto text-sm">من</h4>
              <div className="flex justify-between items-center">
                <CustomDatePicker
                  className="w-[95px] h-[40px] mt-1 text-sm"
                  selected={selectedStartDate}
                  onChange={(date) => setSelectedStartDate(date)}
                />
              </div>
              <h4 className="mx-2 my-auto text-sm">إلى</h4>
              <div className="flex justify-between items-center">
                <CustomDatePicker
                  className="w-[95px] h-[40px] mt-1 text-sm"
                  selected={selectedEndDate}
                  onChange={(date) => setSelectedEndDate(date)}
                />
              </div>
              <h4 className="mx-2 my-auto text-sm">فرز</h4>
              <SelectInput
                className="text-sm font-medium my-auto h-[40px]"
                defaultValue={selectedOrder}
                onChange={e => setSelectedOrder(e.target.value)}
              >
                <option value="total_reduce">الطلبات</option>
                <option value="total_profit">الأرباح</option>
              </SelectInput>
              <SecondaryButton
                className="h-[40px] my-auto mx-2 mt-1"
                onClick={e => searchDataChanged()}
              >
                تصفية
              </SecondaryButton>
            </div>
          </ScrollBar>
        </div>
      }
    >
      <Head title="أرباح المراكز" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<SuccessMessage message={success} />)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-2 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <div className="grid grid-cols-3 gap-4 mb-4 bg-white">
                  <div className="flex items-center p-4 bg-green-100 rounded-lg">
                    <img className="w-24 h-24 rounded-full shadow-lg mx-2" src={max_reduce && max_reduce.center.image ? max_reduce.center.image : '/images/profiles/noimage.jpg'} alt="Bonnie image" />
                    <div className="text-center mx-auto">
                      <h5 className="mb-1 text-xl font-medium text-green-600 dark:text-white">أعلى مبيعات</h5>
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{max_reduce ? max_reduce.center.name : '-'}</h5>
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{max_reduce ? max_reduce.total_reduce.toLocaleString('en-US') : "0"}</h5>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-green-100 rounded-lg">
                    <img className="w-24 h-24 rounded-full shadow-lg mx-2" src={max_profit && max_profit.center.image ? max_profit.center.image : '/images/profiles/noimage.jpg'} alt="Bonnie image" />
                    <div className="text-center mx-auto">
                      <h5 className="mb-1 text-xl font-medium text-green-600 dark:text-white">أعلى نسبة ربح</h5>
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{max_profit ? max_profit.center.name : '-'}</h5>
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{max_profit ? max_profit.total_profit.toLocaleString('en-US') : '0'}</h5>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-green-100 rounded-lg">
                  <div className="text-center mx-auto">
                      <h5 className="mb-1 text-xl font-medium text-green-600 dark:text-white">إجمالي الطلبات</h5>
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{total_reduce_all}</h5>
                    </div>
                    <div className="text-center mx-auto">
                      <h5 className="mb-1 text-xl font-medium text-green-600 dark:text-white">إجمالي الأرباح</h5>
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{total_profit_all}</h5>
                    </div>
                  </div>
                </div>
                <table className="w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200">
                  <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <TableHeading
                        sortable={false}
                      >
                        #
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        المركز
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        الطلبات
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        الربح
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        المسؤول
                      </TableHeading>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {center_balances.data.map((center_balance, index) => (
                      <tr className={`${index < 10 ? 'bg-green-300' : 'bg-white'} border-b dark:bg-gray-800 dark:border-gray-700`} key={center_balance.center.id}>
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2">{center_balance.center.name}</td>
                        <td className="py-2">{center_balance.total_reduce.toLocaleString('en-US')}</td>
                        <td className="py-2">{center_balance.total_profit.toLocaleString('en-US')}</td>
                        <td className="py-2 px-1 ">{center_balance.center.created_by.name}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-center">
                    <tr>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">المجموع</th>
                      <th className="px-3 py-3">{total_reduce_all}</th>
                      <th className="px-3 py-3">{total_profit_all}</th>

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
