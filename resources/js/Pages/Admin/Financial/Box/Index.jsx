import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import CustomDatePicker from "@/Components/CustomDatePicker";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { useState } from "react";
import { format, parse } from "date-fns";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import { GiExpense } from "react-icons/gi";
import { FaRegEdit, FaRegPlusSquare } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function index({
  auth,
  boxs,
  queryParams,
  totalAmount = null,
  success,
  message,
}) {

  queryParams = queryParams || {}

  const [selectedStartDate, setSelectedStartDate] = useState(
    (queryParams['start_date'] && parse(queryParams['start_date'], "dd/MM/yyyy", new Date())) || new Date()
  );

  const [selectedEndDate, setSelectedEndDate] = useState(
    (queryParams['end_date'] && parse(queryParams['end_date'], "dd/MM/yyyy", new Date())) || new Date()
  );

  const searchFieldChanged = (name, value) => {
    queryParams['start_date'] = (selectedStartDate && format(selectedStartDate, "dd/MM/yyyy"));
    queryParams['end_date'] = (selectedEndDate && format(selectedEndDate, "dd/MM/yyyy"));
    router.get(route('box.index'), queryParams)
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
    router.get(route('box.index'), queryParams)
  }

  const deleteBox = (box) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذا المصروف ؟')) {
      return;
    }
    router.post(route('box.destroy', box.id), {
      _method: 'DELETE',
    })
  }

  const editBox = (box) => {
    router.get(route("box.edit", box))
  }

  const addBox = () => {
    router.get(route("box.create"))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <GiExpense className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              النفقات والمصاريف
            </Title>
            <button
              onClick={e => addBox()}
              type="button"
              className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              إضافة
              <FaRegPlusSquare style={{ marginRight: '8px', marginTop: '2px'  }} size={25} />
            </button>
          </ScrollBar>
        </div>
      }
    >
      <Head title="النفقات والمصاريف" />
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
                        name='amount'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المبلغ
                      </TableHeading>
                      <TableHeading
                        name='statment'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        البيان
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
                      <th className="px-3 py-3"></th>
                      <th className="flex px-3 py-3 w-[150px]">
                        <TableHeading
                          sortable={false}
                        >
                          من
                        </TableHeading>
                        <CustomDatePicker
                          className="w-[110px] h-[35px] mt-1"
                          selected={selectedStartDate}
                          onChange={(date) => setSelectedStartDate(date)}
                        >
                        </CustomDatePicker>
                        <TableHeading
                          sortable={false}
                        >
                          إلى
                        </TableHeading>
                        <CustomDatePicker
                          className="flex w-[110px] h-[35px] mt-1"
                          selected={selectedEndDate}
                          onChange={(date) => setSelectedEndDate(date)}
                        >
                        </CustomDatePicker>
                      </th>
                      <th className="px-3 py-3">
                        <SecondaryButton
                          onClick={e => searchFieldChanged()}
                          disabled={!selectedStartDate && !selectedEndDate}
                        >تصفية</SecondaryButton>
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {boxs.data.map((box, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={box.id}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{box.created_at}</td>
                        <td className="px-3 py-2">{box.amount}</td>
                        <td className="px-3 py-2">{box.statment}</td>
                        <td className="px-3 py-2 items-center">
                          <div className="flex justify-center">
                            <button
                              onClick={e => editBox(box)}
                              type="button"
                              className="inline-flex text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                              تعديل
                              <FaRegEdit style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                            </button>
                            <button
                              type="button"
                              onClick={e => deleteBox(box)}
                              className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                              حذف
                              <RiDeleteBin6Line style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-center">
                    <tr>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">المجموع</th>
                      <th className="px-3 py-3">{totalAmount}</th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <Pagination links={boxs.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}