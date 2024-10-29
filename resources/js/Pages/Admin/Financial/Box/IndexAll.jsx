import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import CustomDatePicker from "@/Components/CustomDatePicker";
import { useState } from "react";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { format, parse } from "date-fns";
import ScrollBar from "@/Components/ScrollBar";
import Title from "@/Components/Title";
import { HiMiniCalendarDays } from "react-icons/hi2";

export default function index({
  auth,
  centers,
  products,
  boxs,
  total_center,
  total_product,
  total_box,
  total_centerN,
  total_productN,
  total_boxN,
  queryParams = null,
  message,
}) {

  queryParams = queryParams || {}

  const total = total_centerN - total_productN - total_boxN;
  const [selectedDate, setSelectedDate] = useState(
    (queryParams['date'] && parse(queryParams['date'], "dd/MM/yyyy", new Date())) || new Date()
  );

  const searchFieldChanged = () => {
    queryParams['date'] = (selectedDate && format(selectedDate, "dd/MM/yyyy"));
    router.get(route('box.home'), queryParams);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <HiMiniCalendarDays className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              حركة الصندوق اليومية
            </Title>
            <div className="flex justify-between items-center">
              <h2 className="text-black dark:text-white font-semibold mx-2 mt-1 text-nowrap">اختر التاريخ</h2>
              <CustomDatePicker
                className="w-[110px] h-[35px] mt-1"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
              <SecondaryButton
                className="mx-2 h-9 mt-1"
                onClick={searchFieldChanged}
                disabled={!selectedDate}
              >
                تصفية
              </SecondaryButton> 
            </div>
          </ScrollBar>
        </div>
      }
    >
      <Head title="حركة الصندوق اليومية" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-1 text-gray-900 dark:text-gray-100">
              <div className="flex space-x-4 overflow-x-auto justify-between">
                <div className="w-1/3 min-w-[300px] overflow-auto mx-2 items-center">
                  <h3 className="text-lg font-semibold mb-1 text-center justify-center">المقبوضات من المراكز : {total_center}</h3>
                  <div className="overflow-auto h-[300px]">
                    <table className="w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200 ">
                      <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr>
                          <TableHeading sortable={false}>المبلغ</TableHeading>
                          <TableHeading sortable={false}>المركز</TableHeading>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {centers.map((item) => (
                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                            <td className="px-3 py-2">{item.add.toLocaleString('en-US')}</td>
                            <td className="px-3 py-2">{item.user_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="w-1/3 min-w-[300px] overflow-auto">
                  <h3 className="text-lg font-semibold mb-1 text-center justify-center">المدفوعات للمزودات : {total_product.toLocaleString('en-US')}</h3>
                  <div className="overflow-auto h-[300px]">
                    <table className="w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200 ">
                      <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr>
                          <TableHeading sortable={false}>المبلغ</TableHeading>
                          <TableHeading sortable={false}>المنتج</TableHeading>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {products.map((item) => (
                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                            <td className="px-3 py-2">{item.add.toLocaleString('en-US')}</td>
                            <td className="px-3 py-2">{item.product_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="w-1/3 min-w-[300px] overflow-auto">
                  <h3 className="text-lg font-semibold mb-1 text-center justify-center">مدفوعات نفقات ومصاريف : {total_box}</h3>
                  <div className="overflow-auto h-[300px]">
                    <table className="w-full text-md font-semibold mb-1 rtl:text-right text-gray-800 dark:text-gray-200 ">
                      <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr>
                          <TableHeading sortable={false}>المبلغ</TableHeading>
                          <TableHeading sortable={false}>البيان</TableHeading>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {boxs.map((item) => (
                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                            <td className="px-3 py-2">{item.amount.toLocaleString('en-US')}</td>
                            <td className="px-3 py-2">{item.statment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className={`mt-6 text-center ${(total > 0) ? 'bg-emerald-200' : 'bg-red-200'} rounded-md py-2 text-black`}>
                <h4 className="text-xl font-semibold">إجمالي الصندوق = المقبوضات من المراكز - المدفوعات للمزودات - مدفوعات نفقات ومصاريف</h4>
                <p className="text-lg font-bold">
                  {`${(total).toLocaleString('en-US')}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
