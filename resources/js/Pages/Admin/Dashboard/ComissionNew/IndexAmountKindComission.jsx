import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import TextInput from "@/Components/TextInput";

export default function Index({ auth, users, comissionData, queryParams = null, success, message }) {
  queryParams = queryParams || {}

  const { post } = useForm();
  console.log(comissionData[0]);
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

  // عند تغيير قيمة الحقول
  const handleInputChange = (index, field, value) => {
    const newInputs = [...comissionInputs];
    newInputs[index][field] = value;
    setComissionInputs(newInputs);
  };

  const handleSubmit = () => {
    router.get(route("comission.addorupdate", {
      data: comissionInputs
    }));
  };

  const goCategory = (user) => {
    router.get(route("comission.category", user))
  }

  const goProduct = (user) => {
    router.get(route("comission.product", user))
  }

  const goService = (user) => {
    router.get(route("comission.service", user))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <Title>نسبة العمولة للمركز:
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
                    </tr>
                  </thead>

                  <tbody className="text-center">
                    {comissionData.map((user, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.id}>
                        <td className="px-3 py-2 text-nowrap">{user.amount_kind_name}</td>
                        <td className="px-3 py-2 text-center">
                          <TextInput
                            id={`comission_admin_${index}`}
                            type={user.has_commission ? "number" : "text"}
                            min="0"
                            name={`comission_admin_${index}`}
                            value={user.has_commission ? comissionInputs[index].comission : 'يجب طلب نسبة عمولة من مدير النظام لتتمكن من توزيع العمولة على المراكز'}
                            className={`block w-full h-[40px] ${comissionInputs[index].comission === 0 ? "bg-red-400" : "bg-emerald-400"}`}
                            onChange={(e) => handleInputChange(index, 'comission', e.target.value)}
                            lang="en"
                            disabled={!user.has_commission}
                          />
                          <input type="hidden" value={comissionInputs[index].amount_kind_id} />
                          <input type="hidden" value={comissionInputs[index].user_id} />
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
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              حفظ التعديلات
            </button>
          </div>

        </div>
      </div>
    </AuthenticatedLayout>
  );
}
