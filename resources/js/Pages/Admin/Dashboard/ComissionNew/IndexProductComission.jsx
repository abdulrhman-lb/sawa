import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";

export default function index({ auth, comissionData, queryParams = null, success, message }) {
  queryParams = queryParams || {}

  const editComission = (user) => {
    router.get(route("comission.service", user))
  }

  const goCategory = (user) => {
    router.get(route("comission.category", user))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <Title>نسبة العمولة للمركز: {comissionData[0].user_name}
            <span className="text-red-700 text-2xl mx-2"> | </span>
            <button onClick={e => goCategory(comissionData[0])} >
              {comissionData[0].category}
            </button>
          </Title>
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
                        المنتج
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
                        <td className="px-3 py-2 text-nowrap">{user.product}</td>
                        <td className="px-3 py-2">
                          <div className="px-3 py-2 text-right">
                            {user.services.map((product) => (
                              <span className="bg-blue-600 rounded-md px-3 py-1 text-center min-w-[140px] inline-block font-normal text-white m-1">
                                {product}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-nowrap ">
                          <PrimaryButton onClick={e => editComission(user)}>عرض</PrimaryButton>
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
