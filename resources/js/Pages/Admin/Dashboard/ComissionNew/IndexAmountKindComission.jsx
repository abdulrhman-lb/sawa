import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import TextInput from "@/Components/TextInput";
import { FaCreativeCommonsZero, FaRegSave } from "react-icons/fa";
import ScrollBar from "@/Components/ScrollBar";

export default function Index({
  auth,
  users,
  comissionData,
  queryParams = null,
  success,
  message,
}) {

  queryParams = queryParams || {}

  const { post } = useForm();
  const [comissionInputs, setComissionInputs] = useState(
    comissionData.map((user) => ({
      user_id: users.id,
      amount_kind_id: user.amount_kinds.id,
      comission: auth.user.kind === 'admin' ? (
        user.comissions.length > 0 ? user.comissions[0].comission_admin : 0
      ) : (
        user.comissions.length > 0 ? user.comissions[0].comission_super : 0
      ),
    }))
  );

  const handleInputChange = (index, field, value) => {
    const newInputs = [...comissionInputs];
    newInputs[index][field] = value;
    setComissionInputs(newInputs);
  };

  const handleSubmit = () => {
    router.get(route("comission.addorupdate", {
      data: comissionInputs,
      'user_id': comissionData[0].user_id,
      'amount_kind_id': comissionData[0].amount_kind_id
    }));
  };

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

  const goService = (user) => {
    console.log(user)
    router.get(route("comission.service", {
      'user_id': user.user_id,
      'product_id': user.product_id
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
              نسبة العمولة للمركز:
              {comissionData[0].user_name}
              <span className="text-red-700 text-2xl mx-2">|</span>
              <button onClick={e => goCategory(comissionData[0])}>
                {comissionData[0].category}
              </button>
              <span className="text-red-700 text-2xl mx-2">|</span>
              <button onClick={e => goProduct(comissionData[0])}>
                {comissionData[0].product}
              </button>
              <span className="text-red-700 text-2xl mx-2">|</span>
              <button onClick={e => goService(comissionData[0])}>
                {comissionData[0].service}
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
                      <TableHeading sortable={false}>تفاصيل الخدمة</TableHeading>
                      <TableHeading sortable={false}>نسب العمولة</TableHeading>
                      <TableHeading sortable={false}>السعر الأصلي</TableHeading>
                      <TableHeading sortable={false}>السعر بعد العمولة</TableHeading>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {comissionData.map((user, index) => (
                      <tr className="   border-b" key={user.id}>
                        <td className="px-3 py-2 text-nowrap">{user.amount_kind_name}</td>
                        <td className="px-3 py-2 text-center">
                          <TextInput
                            id={`comission_admin_${index}`}
                            type={user.has_commission ? "number" : "text"}
                            min="0"
                            name={`comission_admin_${index}`}
                            value={user.has_commission ? comissionInputs[index].comission : 'يجب طلب نسبة عمولة من مدير النظام لتتمكن من توزيع العمولة على المراكز'}
                            className={`block w-full h-[40px] ${comissionInputs[index].comission === 0 ? "bg-red-400 dark:bg-red-900" : "bg-emerald-400 dark:bg-emerald-900"}`}
                            onChange={(e) => handleInputChange(index, 'comission', e.target.value)}
                            lang="en"
                            disabled={!user.has_commission}
                          />
                          <input type="hidden" value={comissionInputs[index].amount_kind_id} />
                          <input type="hidden" value={comissionInputs[index].user_id} />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <TextInput
                            type="number"
                            min="0"
                            name={`amount_${index}`}
                            value={user.amount_kinds.amount}
                            className={`block w-full h-[40px] ${comissionInputs[index].comission === 0 ? "bg-red-400 dark:bg-red-900" : "bg-emerald-400 dark:bg-emerald-900"}`}
                            lang="en"
                            disabled={true}
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <TextInput
                            type="number"
                            min="0"
                            name={`amount_${index}`}
                            value={user.amount_kinds.amount + (comissionInputs[index].comission * user.amount_kinds.amount / 100)}
                            className={`block w-full h-[40px] ${comissionInputs[index].comission === 0 ? "bg-red-400 dark:bg-red-900" : "bg-emerald-400 dark:bg-emerald-900"}`}
                            lang="en"
                            disabled={true}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="text-center my-2">
            <button
              onClick={handleSubmit}
              type="submit"
              className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              حفظ التعديلات
              <FaRegSave style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
