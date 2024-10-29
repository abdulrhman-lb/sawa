import ScrollBar from "@/Components/ScrollBar";
import Title from "@/Components/Title";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { FaRegEdit, FaUserTie } from "react-icons/fa";
import { MdOutlineCancel, MdOutlineSendToMobile } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";



export default function Edit({
  auth,
  customer,
  message,
  amount_kind,
  comission,
  balanceCenter,
  balanceProduct
}) {
  const [processing, setProcessing] = useState(false);

  const acceptPayment = (customer) => {
    setProcessing(true);
    router.get(route("customer.payment.accept", {'id': customer.id}))
  }
  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <FaUserTie className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              تسديد فاتورة للزبون  "{customer.name}"
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="الزبائن" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="text-xl dark:text-gray-100 font-semibold m-4">
              <h1 className="pb-2 text-red-700">تفاصيل الطلب</h1>
              <h1 className="pb-2">التصنيف : {amount_kind.service.product.category.name}</h1>
              <h1 className="pb-2">المزود : {amount_kind.service.product.name}</h1>
              <h1 className="pb-2">السرعة : {amount_kind.kindName.name}</h1>
              <h1 className="pb-2">السعر : {amount_kind.amount}</h1>
              <h1 className="pb-2">نسبة العمولة : {(comission)
                && (comission.comission_admin != 0) ?
                (comission.comission_admin + comission.comission_super + '%')
                : "لا يوجد نسبة عمولة يرجى مراجعة المسؤول"
              }
              </h1>
              <h1 className="pb-2">الصافي : {(comission)
                && (comission.comission_admin != 0) ?
                (amount_kind.amount + amount_kind.amount * (comission.comission_admin + comission.comission_super) / 100)
                : "-"
              }
              </h1>
              <h1 className="pb-2">رقم الهاتف الأرضي : {customer.phone}</h1>
              <div className="text-center">
                {balanceCenter === 0 &&
                  <>
                    <h1 className="text-red-800">ليس لديك رصيد كافي لاتمام العملية</h1>
                  </>
                }
                {balanceProduct === 0 &&
                  <>
                    <h1 className="text-red-800">لايوجد رصيد كافي في المزود لاتمام العملية</h1>
                  </>
                }
              </div>
              {(balanceCenter === 1 && balanceProduct === 1) &&
                <div className="flex justify-center">
                  <button
                    onClick={e => acceptPayment(customer)}
                    disabled={processing}
                    type="button"
                    className="inline-flex text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                    إرسال الطلب
                    <MdOutlineSendToMobile style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                  </button>
                  <Link href={route('customer.index')} >
                    <button
                      type="button"
                      disabled={processing}
                      className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                      إلغاء الأمر
                      <MdOutlineCancel style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
                    </button>
                  </Link>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  )
}
