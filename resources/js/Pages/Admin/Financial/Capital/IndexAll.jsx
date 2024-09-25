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
  total_centerN,
  total_productN,
  total_boxN,
  queryParams = null,
}) {

  const total = total_centerN - total_productN - total_boxN;
  queryParams = queryParams || {}

  const [selectedDate, setSelectedDate] = useState((queryParams['date'] && format(queryParams['date'], "dd-MM-yyyy")) || new Date());

  const searchFieldChanged = () => {
    queryParams['date'] = (selectedDate && format(selectedDate, "dd-MM-yyyy"));
    router.get(route('box.home'), queryParams);
  };

  const tablesData = [
    { id: 1, title: 'جدول المراكز', data: centers, total: total_center },
    { id: 2, title: 'جدول المنتجات', data: centers, total: total_center },
    { id: 3, title: 'جدول الصناديق', data: centers, total: total_center }
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <Title>حركة الصندوق اليومية</Title>
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
                  <h3 className="text-lg font-semibold mb-1 text-center justify-center">ايرادات المراكز</h3>
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
                      <tfoot className="text-center">
                        <tr>
                          <th className="px-3 py-3">{total_center}</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="w-1/3 min-w-[300px] overflow-auto">
                  <h3 className="text-lg font-semibold mb-1 text-center justify-center">مدفوعات المنتجات</h3>
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
                      <tfoot className="text-center">
                        <tr>
                          <th className="px-3 py-3">{total_product.toLocaleString('en-US')}</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="w-1/3 min-w-[300px] overflow-auto">
                  <h3 className="text-lg font-semibold mb-1 text-center justify-center">النفقات والمصاريف</h3>
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
                      <tfoot className="text-center">
                        <tr>
                          <th className="px-3 py-3">{total_box}</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* إضافة إجمالي تحت الجداول الثلاث */}
              <div className={`mt-6 text-center ${(total > 0) ? 'bg-emerald-200' : 'bg-red-200'} rounded-md py-2 text-black`}>
                <h4 className="text-xl font-semibold">إجمالي الصندوق</h4>
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
