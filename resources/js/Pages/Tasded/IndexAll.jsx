import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import { AiOutlineDatabase } from "react-icons/ai";
import { LuCheckCircle } from "react-icons/lu";
import { useState } from "react";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";


export default function index({ auth, tasdeds, success, message }) {

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedTasded, setSelectedTasded] = useState(null);
  const [amountTasded, setAmountTasded] = useState(null);

  const openApproveModal = (tasded) => {
    setSelectedTasded(tasded);
    setShowApproveModal(true);
  }


  const handleTasded = () => {
    router.post(route('tasded.response'), {
      id: selectedTasded.id,
      amount: amountTasded,
    });
    setShowApproveModal(false);
    setAmountTasded(null);
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <AiOutlineDatabase className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              استعلام طلبات تسديد من المراكز
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="استعلام طلبات تسديد من المراكز" />
      <Modal show={showApproveModal} onClose={() => setShowApproveModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">الرد على استعلام تسديد</h2>
          <div className="mt-6 justify-end">
            <div>
              <TextInput
                type="number"
                className="mt-4"
                placeholder="المبلغ"
                value={amountTasded}
                min={0}
                onChange={(e) => setAmountTasded(e.target.value)}
                lang="en"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleTasded}
                type="button"
                className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                موافق
                <LuCheckCircle style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<SuccessMessage message={success} />)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-2 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-md font-medium rtl:text-right text-gray-800 dark:text-gray-200">
                  <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <TableHeading
                        sortable={false}
                      >
                        #
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        المركز
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        رقم الهاتف
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        المبلغ
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        الرد
                      </TableHeading>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {tasdeds.data.map((tasded, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={tasded.id}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2 text-nowrap">{tasded.user.name}</td>
                        <td className="px-3 py-2 text-nowrap">{tasded.phone}</td>
                        <td className="px-3 py-2 text-nowrap">
                          {tasded.amount === 0 ?
                            'بانتظار الرد على الاستعلام'
                            :
                            tasded.amount
                          }
                        </td>
                        <td className="px-3 py-2 text-nowrap">
                          {tasded.amount === 0 ?
                            <button
                              onClick={() => openApproveModal(tasded)}
                              type="button"
                              className="inline-flex text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                              الرد للمركز
                              <LuCheckCircle style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                            </button>
                            :
                            'تم الرد على الاستعلام'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex px-4">
                <div className="flex mx-auto">
                  <Pagination links={tasdeds.meta.links} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
