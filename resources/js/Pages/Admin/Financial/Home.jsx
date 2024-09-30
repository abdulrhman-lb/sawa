import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import CountUp from "react-countup";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollBar from "@/Components/ScrollBar";
import Title from "@/Components/Title";
import { FaBorderNone } from "react-icons/fa";

export default function Home({ auth, total_product, total_center, total_box, message, initialNotifications }) {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      notification={initialNotifications}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <FaBorderNone className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              إجمالي البيان المالي
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="إجمالي البيان المالي" />
      <div className="py-4 text-center">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid lg:grid-cols-2 sm:grid-cols-1 gap-2 relative">
          <div data-aos="fade-down" data-aos-delay={300} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg relative">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h3 className="text-amber-500 text-2xl font-semibold">
                إجمالي أرصدة المنتجات
              </h3>
              <p className="text-xl mt-4">
                <span className="mx-2 font-semibold">
                  <CountUp start={0} end={total_product} duration={2} delay={0} />
                </span>
              </p>
            </div>
          </div>
          <div data-aos="fade-down" data-aos-delay={300} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg relative">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h3 className="text-blue-500 text-2xl font-semibold">
                إجمالي أرصدة المراكز
              </h3>
              <p className="text-xl mt-4">
                <span className="mx-2 font-semibold">
                  <CountUp start={0} end={total_center} duration={2} delay={0} />
                </span>
              </p>
            </div>
          </div>
          <div data-aos="fade-down" data-aos-delay={300} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg relative">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h3 className="text-green-500 text-2xl font-semibold">
                إجمالي النفقات والمصاريف
              </h3>
              <p className="text-xl mt-4">
                <span className="mx-2 font-semibold">
                  <CountUp start={0} end={total_box} duration={2} delay={0} />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid lg:grid-cols-1 sm:grid-cols-1 gap-2 relative mt-2">
          <div data-aos="fade-down" data-aos-delay={300} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg relative">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h3 className="text-amber-500 text-2xl font-semibold">
                إجمالي أرصدة المنتجات
              </h3>
              <p className="text-xl mt-4">
                <span className="mx-2 font-semibold">
                  <CountUp start={0} end={total_product} duration={2} delay={0} />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div data-aos="fade-up" data-aos-delay={500} className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-52">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h3 className="dark:text-gray-200 text-xl font-semibold">
                رأس المال الفعلي
              </h3>
              <table className="w-full text-sm rtl:text-right text-gray-500 dark:text-gray-400 mt-4 text-center justify-center">
                <thead className="text-lg text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                  <tr className="text-center">
                    <th className="px-3 py-3">التاريخ</th>
                    <th className="px-3 py-3">المبلغ</th>
                    <th className="px-3 py-3">البيان</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
