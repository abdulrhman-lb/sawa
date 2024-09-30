import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import { FaCreativeCommonsZero } from "react-icons/fa6";

export default function index({ 
  auth, 
  comissionData, 
  admins, 
  queryParams = null, 
  success, 
  message, 
  initialNotifications
 }) {

  queryParams = queryParams || {}

  const editComission = (user) => {
    router.get(route("comission.amountkind", user))
  }

  const goCategory = (user) => {
    router.get(route("comission.category", user))
  }

  const goProduct = (user) => {
    router.get(route("comission.product", user))
  }
  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      notification={initialNotifications}
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
                    {comissionData.map((user) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.id}>
                        <td className="px-3 py-2 text-nowrap">{user.service}</td>
                        <td className="px-3 py-2">
                          <div className="px-3 py-2 text-right">
                            {user.amount_kinds.map((amount_kind) => (
                              <span className="bg-blue-600 rounded-md px-3 py-1 text-center min-w-[140px] inline-block font-normal text-white m-1">
                                {amount_kind}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-nowrap ">
                          <PrimaryButton onClick={e => editComission(user)}>تعديل نسبة العمولة</PrimaryButton>
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
