import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import { AiOutlineDatabase } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegPlusSquare } from "react-icons/fa";


export default function index({ auth, datakinds, queryParams = null, success, message }) {
  queryParams = queryParams || {}
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    queryParams.page = 1;
    router.get(route('datakind.index'), queryParams)
  }

  const onKeyPress = (name, e) => {
    if (e.key !== 'Enter') return;
    searchFieldChanged('name', e.target.value);
  }

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === 'asc') {
        queryParams.sort_direction = 'desc';
      } else {
        queryParams.sort_direction = 'asc';
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }
    queryParams.page = 1;
    router.get(route('datakind.index'), queryParams)
  }

  const colChanged = (name, value) => {
    queryParams[name] = value;
    queryParams.page = 1;
    router.get(route('datakind.index'), queryParams)
  }

  const deleteDataKind = (datakind) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذا النوع من البيانات؟')) {
      return;
    }
    router.post(route('datakind.destroy', datakind.id), {
      _method: 'DELETE',
    })
  }

  const editDataKind = (datakind) => {
    router.get(route("datakind.edit", datakind))
  }

  const addDataKind = () => {
    router.get(route("datakind.create"))
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
              انواع بيانات الخدمات
            </Title>
            <button
              onClick={e => addDataKind()}
              type="button"
              className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
              إضافة
              <FaRegPlusSquare style={{ marginRight: '8px', marginTop: '2px' }} size={25} />
            </button>
          </ScrollBar>
        </div>
      }
    >
      <Head title="أنواع بيانات الخدمات" />
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
                        #
                      </TableHeading>
                      <TableHeading
                        name='name'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        نوع بيانات الخدمات
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        التحكم
                      </TableHeading>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                    <th className="py-3 text-center">
                        <SelectInput
                          className="text-sm font-medium"
                          defaultValue={queryParams.col}
                          onChange={e => colChanged('col', e.target.value)}
                        >
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="75">75</option>
                          <option value="100">100</option>
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.name}
                          placeholder="نوع بيانات الخدمات"
                          onBlur={e => searchFieldChanged('name', e.target.value)}
                          onKeyPress={e => onKeyPress('name', e)}
                        >
                        </TextInput>
                      </th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {datakinds.data.map((datakind, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={datakind.id}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2 text-nowrap">{datakind.name}</td>
                        <td className="px-3 py-2 items-center">
                          <div className="flex justify-center">
                            <button
                              onClick={e => editDataKind(datakind)}
                              type="button"
                              className="inline-flex text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                              تعديل
                              <FaRegEdit style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                            </button>
                            <button
                              type="button"
                              onClick={e => deleteDataKind(datakind)}
                              className="flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                              حذف
                              <RiDeleteBin6Line style={{ marginRight: '8px', marginTop: '4px' }} size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex px-4">
                <SelectInput
                  className="text-sm font-medium mt-4"
                  defaultValue={queryParams.col}
                  onChange={e => colChanged('col', e.target.value)}
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                  <option value="100">100</option>
                </SelectInput>
                <div className="flex mx-auto">
                  <Pagination links={datakinds.meta.links} queryParams={queryParams} />
                </div>
                <div className="mt-4">
                  <h3>إجمالي السجلات : {datakinds.data.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
