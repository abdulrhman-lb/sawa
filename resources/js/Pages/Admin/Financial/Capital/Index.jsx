import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import CountUp from "react-countup";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import TableHeading from "@/Components/TableHeading";
import ScrollBar from "@/Components/ScrollBar";
import Title from "@/Components/Title";
import { GiCash, GiExpense, GiPayMoney, GiProfit, GiTakeMyMoney } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit, FaRegPlusSquare } from "react-icons/fa";
import { MdAccountTree, MdOutlineAccountTree } from "react-icons/md";
import { HiMiniCalendarDays } from "react-icons/hi2";
import { PiListNumbersFill } from "react-icons/pi";
import { IoCashOutline } from "react-icons/io5";

export default function Home({
  auth,
  capitals,
  total_profit,
  totalAmountN,
  totalAmount,
  total_product,
  total_center,
  total_box,
  message,
  sum1,
  sum2,
  center_count,
  product_count,
  balance
}) {

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const deleteCapital = (capital) => {
    if (!window.confirm('هل تريد بالتأكيد حذف رأس المال ؟')) {
      return;
    }
    router.post(route('capital.destroy', capital.id), {
      _method: 'DELETE',
    })
  }

  const editCapital = (capital) => {
    router.get(route("capital.edit", capital))
  }

  const addCapital = () => {
    router.get(route("capital.create"))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <GiCash className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              الصندوق الختامي
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="الصندوق الختامي" />
      <div className="py-2 text-center">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
          <div className="h-full w-full bg-gray-100 pt-8 p-4 rounded-md">
            <div className="grid gap-14 md:grid-cols-4 md:gap-5">
              <div data-aos="fade-down" data-aos-delay="50" className="rounded-xl bg-white py-6 text-center shadow-xl mb-4">
                <div
                  className="mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full bg-teal-400 shadow-lg shadow-teal-500/40">
                  <MdOutlineAccountTree className="size-8 text-white" />
                </div>
                <h1 className="text-darken mb-3 text-xl font-medium lg:px-14">إجمالي أرصدة المراكز</h1>
                <p className="px-4 text-gray-800 text-xl font-semibold">
                  <CountUp start={0} end={total_center} duration={2} delay={0} />
                </p>
              </div>
              <div data-aos="fade-down" data-aos-delay="200" className="rounded-xl bg-white py-6 text-center shadow-xl mb-4">
                <div
                  className="mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full shadow-lg bg-sky-500 shadow-sky-500/40">
                  <MdAccountTree className="size-8 text-white" />
                </div>
                <h1 className="text-darken mb-3 text-xl font-medium lg:px-14 ">إجمالي أرصدة المنتجات</h1>
                <p className="px-4 text-gray-800 text-xl font-semibold">
                  <CountUp start={0} end={total_product} duration={2} delay={0} />
                </p>
              </div>
              <div data-aos="fade-down" data-aos-delay="400" className="rounded-xl bg-white py-6 text-center shadow-xl mb-4">
                <div
                  className="mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full shadow-lg bg-teal-400 shadow-teal-500/40">
                  <IoCashOutline className="size-8 text-white" />
                </div>
                <h1 className="text-darken mb-3 text-xl font-medium lg:px-14 ">رأس المال</h1>
                <p className="px-4 text-gray-800 text-xl font-semibold">
                  <CountUp start={0} end={totalAmountN} duration={2} delay={0} />
                </p>
              </div>
              <div data-aos="fade-down" data-aos-delay="600" className="rounded-xl bg-white py-6 text-center shadow-xl mb-4">
                <div
                  className="mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full shadow-lg bg-orange-500 shadow-orange-500/40">
                  <GiPayMoney className="size-8 text-white" />
                </div>
                <h1 className="text-darken mb-3 text-xl font-medium lg:px-14 ">دين المراكز</h1>
                <p className="px-4 text-gray-800 text-xl font-semibold">
                  <CountUp start={0} end={balance} duration={2} delay={0} />
                </p>
              </div>
              <div data-aos="fade-down" data-aos-delay="800" className="rounded-xl bg-white py-6 text-center shadow-xl mb-4">
                <div
                  className="mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full shadow-lg bg-sky-500 shadow-sky-500/40">
                  <GiProfit className="size-8 text-white" />
                </div>
                <h1 className="text-darken mb-3 text-xl font-medium lg:px-14 ">إجمالي الأرباح</h1>
                <p className="px-4 text-gray-800 text-xl font-semibold">
                  <CountUp start={0} end={total_profit} duration={2} delay={0} />
                </p>
              </div>
              <div data-aos="fade-down" data-aos-delay="1000" className="rounded-xl bg-white py-6 text-center shadow-xl mb-4">
                <div
                  className="mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full shadow-lg bg-rose-500 shadow-rose-500/40">
                  <GiExpense className="size-8 text-white" />
                </div>
                <h1 className="text-darken mb-3 text-xl font-medium lg:px-14 ">النفقات والمصاريف</h1>
                <p className="px-4 text-gray-800 text-xl font-semibold">
                  <CountUp start={0} end={total_box} duration={2} delay={0} />
                </p>
              </div>
              <div data-aos="fade-down" data-aos-delay="1200" className="rounded-xl bg-white py-6 text-center shadow-xl mb-4">
                <div
                  className="mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full shadow-lg bg-orange-500 shadow-orange-500/40">
                  <GiCash className="size-8 text-white" />
                </div>
                <div className="inline-flex grid-cols-2 justify-between gap-8">
                  <div className="justify-center">
                    <h1 className="text-center mb-3 text-xl font-medium">صافي الأرباح</h1>
                    <p className="px-4 text-gray-800 text-xl font-semibold">
                      {/* <CountUp start={0} end={center_count} duration={2} delay={0} /> */}
                      <CountUp start={0} end={total_profit - total_box} duration={2} delay={0} />
                    </p>
                  </div>
                  {/* <div className=" text-center">
                    <h1 className="text-darken mb-3 text-xl font-medium ">عدد المنتجات</h1>
                    <p className="px-4 text-gray-800 text-xl font-semibold">
                      <CountUp start={0} end={product_count} duration={2} delay={0} />
                    </p>
                  </div> */}
                </div>
              </div>
              <div data-aos="fade-down" data-aos-delay="1400" className="rounded-xl bg-white py-6 text-center shadow-xl mb-4">
                <div
                  className="mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full shadow-lg bg-green-500 shadow-green-500/40">
                  <GiTakeMyMoney className="size-8 text-white" />
                </div>
                <h1 className="text-darken mb-3 text-xl font-medium lg:px-14 ">الصافي النقدي</h1>
                <p className="px-4 text-gray-800 text-xl font-semibold">
                  <CountUp start={0} end={sum1 - sum2} duration={2} delay={0} />
                </p>
              </div>

            </div>
          </div>
        </div>
        <div data-aos="fade-up" data-aos-delay={500} className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100 justify-between">
              <div className="flex justify-between items-center mx-10 mb-4">
                <h3 className="dark:text-gray-200 text-xl font-semibold">
                  رأس المال
                </h3>
                <button
                  onClick={e => addCapital()}
                  type="button"
                  className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                  إضافة
                  <FaRegPlusSquare style={{ marginRight: '8px', marginTop: '2px' }} size={25} />
                </button>
              </div>
              <table className="w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200">
                <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                  <tr className="text-nowrap">
                    <TableHeading sortable={false} >التاريخ</TableHeading>
                    <TableHeading sortable={false} >المبلغ</TableHeading>
                    <TableHeading sortable={false} >البيان</TableHeading>
                    <TableHeading sortable={false} >التحكم</TableHeading>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {capitals.data.map((capital) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={capital.id}>
                      <td className="px-3 py-2">{capital.created_at}</td>
                      <td className="px-3 py-2">{capital.amount.toLocaleString('en-US')}</td>
                      <td className="px-3 py-2">{capital.statment}</td>
                      <td className="px-3 py-2 items-center">
                        <div className="flex justify-center">
                          <button
                            onClick={e => editCapital(capital)}
                            type="button"
                            className="inline-flex text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                            تعديل
                            <FaRegEdit style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={e => deleteCapital(capital)}
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
                    <th className="px-3 py-3">المجموع</th>
                    <th className="px-3 py-3">{totalAmount}</th>
                    <th className="px-3 py-3"></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
