import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import { FaCreativeCommonsZero } from "react-icons/fa6";
import { RiEditLine, RiListView } from "react-icons/ri";

export default function index({
  auth,
  comissionData,
  admins,
  queryParams = null,
  success,
  message,
}) {

  queryParams = queryParams || {}

  const editComission = (user) => {
    router.get(route("comission.amountkind", {
      'user_id': user.user_id,
      'service_id': user.service_id
    }))
  }

  const goCategory = (user) => {
    router.get(route("comission.category", {
      'user_id': user.user_id,
      'category_id': user.category_id
    }))
  }

  const goProduct = (user) => {
    router.get(route("comission.product", {
      'user_id': user.user_id,
      'category_id': user.category_id
    }))
  }
  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <FaCreativeCommonsZero className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              نسبة العمولة للمركز: {comissionData[0].user_name}
              <span className="text-red-700 text-2xl mx-2">|</span>
              <button onClick={e => goCategory(comissionData[0])}>
                {comissionData[0].category}
              </button>
              <span className="text-red-700 text-2xl mx-2">|</span>
              <button onClick={e => goProduct(comissionData[0])}>
                {comissionData[0].product}
              </button>
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="نسبة العمولة" />
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
                        الخدمة
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        نسب العمولة المحددة
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        التحكم
                      </TableHeading>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {comissionData.map((user, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                        <td className="px-3 py-2 text-nowrap">{user.service}</td>
                        <td className="px-3 py-2">
                          <div className="px-3 py-2 text-right">
                            {user.amount_kinds.map((amount_kind, index) => (
                              <span key={index} className="min-w-[90px] inline-block text-center bg-indigo-800 text-indigo-100 text-lg font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300 my-1">
                                {amount_kind}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-nowrap ">
                          <button
                            onClick={e => editComission(user)}
                            type="button"
                            className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                            تعديل نسبة العمولة
                            <RiEditLine style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
