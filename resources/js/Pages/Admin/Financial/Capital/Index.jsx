import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import CountUp from "react-countup";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AddButton from "@/Components/Buttons/AddButton";
import TableHeading from "@/Components/TableHeading";

export default function Home({ 
  auth, 
  capitals, 
  total_profit, 
  totalAmountN, 
  totalAmount, 
  total_product, 
  total_center, 
  total_box,
  sum1,
  sum2
 }) {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  const addCapital = () => {
    router.get(route("capital.create"))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            إجمالي البيان المالي
          </h2>
        </div>
      }
    >
      <Head title="إجمالي البيان المالي" />

      <div className="py-4 text-center">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-2 gap-2">
          <div data-aos="fade-down" data-aos-delay={0} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg relative h-20">
            <div className="flex p-6 text-gray-900 dark:text-gray-100 justify-between">
              <h3 className="text-blue-500 text-2xl font-semibold">
                إجمالي أرصدة المراكز
              </h3>
              <div className="text-right w-36">
                <p className="text-2xl">
                  <span className="mx-2 font-semibold">
                    <CountUp start={0} end={total_center} duration={2} delay={0} />
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div data-aos="fade-down" data-aos-delay={0} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg relative h-20">
            <div className="flex p-6 text-gray-900 dark:text-gray-100 justify-between">
              <h3 className="text-amber-500 text-2xl font-semibold">
                إجمالي أرصدة المنتجات
              </h3>
              <div className="text-right w-36">
                <p className="text-2xl">
                  <span className="mx-2 font-semibold">
                    <CountUp start={0} end={total_product} duration={2} delay={0} />
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div data-aos="fade-down" data-aos-delay={500} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg relative h-20">
            <div className="flex p-6 text-gray-900 dark:text-gray-100 justify-between">
              <h3 className="text-green-500 text-2xl font-semibold">
                إجمالي الأرباح
              </h3>
              <div className="text-right w-36">
                <p className="text-2xl">
                  <span className="mx-2 font-semibold justify-end">
                    <CountUp start={0} end={total_profit} duration={2} delay={0} />
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div data-aos="fade-down" data-aos-delay={500} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg relative h-20">
            <div className="flex p-6 text-gray-900 dark:text-gray-100 justify-between">
              <h3 className="text-amber-500 text-2xl font-semibold">
                إجمالي النفقات والمصاريف
              </h3>
              <div className="text-right w-36">
                <p className="text-2xl">
                  <span className="mx-2 font-semibold">
                    <CountUp start={0} end={total_box} duration={2} delay={0} />
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div data-aos="fade-down" data-aos-delay={1000} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg relative h-20">
            <div className="flex p-6 text-gray-900 dark:text-gray-100 justify-between">
              <h3 className="text-blue-500 text-2xl font-semibold">
                إجمالي رأس المال
              </h3>
              <div className="text-right w-36">
                <p className="text-2xl">
                  <span className="mx-2 font-semibold">
                    <CountUp start={0} end={totalAmountN} duration={2} delay={0} />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-2 relative mt-2">
          <div data-aos="fade-left" data-aos-delay={1500} className="bg-emerald-500/20 overflow-hidden shadow-sm sm:rounded-lg relative">
            <div className="flex p-6 text-gray-900 dark:text-gray-100 justify-between">
              <h3 className="text-blue-500 text-2xl font-semibold">
                المجموع
              </h3>
              <div className="text-right w-36 ">
                <p className="text-2xl">
                  <span className="mx-2 font-semibold">
                    <CountUp start={0} end={sum1} duration={2} delay={0} />
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div data-aos="fade-right" data-aos-delay={1500} className="bg-red-500/20 overflow-hidden shadow-sm sm:rounded-lg relative">
            <div className="flex p-6 text-gray-900 dark:text-gray-100 justify-between">
              <h3 className="text-amber-500 text-2xl font-semibold">
                المجموع
              </h3>
              <div className="text-right w-36">
                <p className="text-2xl">
                  <span className="mx-2 font-semibold">
                    <CountUp start={0} end={sum2} duration={2} delay={0} />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid lg:grid-cols-1 gap-2 relative mt-2">
          <div data-aos="fade-up" data-aos-delay={2000} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg relative">
            <div className="flex p-6 text-gray-900 dark:text-gray-100 justify-between px-56">
              <h3 className="text-green-500 text-2xl font-semibold">
                الفرق ويمثل القيمة النقدية 
              </h3>
              <div className="text-right w-36 ">
                <p className="text-2xl">
                  <span className="mx-2 font-semibold">
                    <CountUp start={0} end={sum1-sum2} duration={2} delay={0} />
                  </span>
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
                  رأس المال الفعلي
                </h3>
                <AddButton onClick={e => addCapital()}>إضافة</AddButton>
              </div>
              <table className="w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200">
                <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                  <tr className="text-nowrap">
                    <TableHeading sortable={false} >التاريخ</TableHeading>
                    <TableHeading sortable={false} >المبلغ</TableHeading>
                    <TableHeading sortable={false} >البيان</TableHeading>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {capitals.data.map((capital) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={capital.id}>
                      <td className="px-3 py-2">{capital.created_at}</td>
                      <td className="px-3 py-2">{capital.amount.toLocaleString()}</td>
                      <td className="px-3 py-2">{capital.statment}</td>
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
    </AuthenticatedLayout>
  );
}
