import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";

export default function IndexTasdedUser({
  tasdeds,
  className = '',
}) {

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("tasded.store"))
  }

  return (
    <section className={className}>
      <div className="text-gray-900 dark:text-gray-100">
        <h1 className="text-lg text-center font-medium bg-cyan-800 text-white p-2 rounded-md mb-2">طلبات الاستعلام عن رصيد</h1>
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
                  رقم الهاتف
                </TableHeading>
                <TableHeading
                  sortable={false}
                >
                  المبلغ
                </TableHeading>
              </tr>
            </thead>
            <tbody className="text-center">
              {tasdeds.data.map((tasded, index) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={tasded.id}>
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2 text-nowrap">{tasded.phone}</td>
                  <td className="px-3 py-2 text-nowrap">
                    {tasded.amount === 0 ?
                      'بانتظار الرد على الاستعلام'
                      :
                      tasded.amount
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
    </section>
  )
}
