import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import CustomDatePicker from "@/Components/CustomDatePicker";
import { useState } from "react";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { format } from "date-fns";

export default function index({
  auth,
  centers,
  products,
  boxs,
  total_center,
  total_product,
  total_box,
  queryParams = null,
}) {

  queryParams = queryParams || {}

  const [selectedDate, setSelectedDate] = useState((queryParams['date'] && format(queryParams['date'], "dd-MM-yyyy")) || new Date());

  const searchFieldChanged = (name, value) => {
    queryParams['date'] = (selectedDate && format(selectedDate, "dd-MM-yyyy"));
    router.get(route('box.home'), queryParams)
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            حركة الصندوق اليومية
          </h2>
          <div className="flex justify-between items-center">
            <TableHeading
              sortable={false}
            >
              اختر التاريخ
            </TableHeading>
            <CustomDatePicker
              className="w-[110px] h-[35px] mt-1"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            >
            </CustomDatePicker>

            <SecondaryButton
            className="mx-2 h-9 mt-1"
              onClick={e => searchFieldChanged()}
              disabled={!selectedDate}
            >تصفية</SecondaryButton>
          </div>
        </div>
      }
    >
      <Head title="حركة الصندوق اليومية" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200">
                  <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <TableHeading
                        sortable={false}
                      >
                        المبلغ
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        المركز
                      </TableHeading>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {centers.map((center) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={centers.id}>
                        <td className="px-3 py-2">{center.add.toLocaleString()}</td>
                        <td className="px-3 py-2">{center.user_name}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-center">
                    <tr>
                      <th className="px-3 py-3">{total_center}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
