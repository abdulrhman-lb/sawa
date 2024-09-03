import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { STATUS_CLASS_MAP, STATUS_TEXT_MAP } from "@/constants";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DeleteButton from "@/Components/Buttons/DeleteButton";
import AddButton from "@/Components/Buttons/AddButton";

export default function index({ auth, kinds, queryParams = null, success }) {
  queryParams = queryParams || {}
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    queryParams.page = 1;
    router.get(route('kind.index'), queryParams)
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
    router.get(route('kind.index'), queryParams)
  }

  const deleteKind = (kind) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذا التفصيل من الخدمات؟')) {
      return;
    }
    router.delete(route('kind.destroy', kind.id))
  }

  const editKind = (kind) => {
    router.get(route("kind.edit", kind))
  }

  const addKind = () => {
    router.get(route("kind.create"))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            تفاصيل الخدمات
          </h2>
          <AddButton onClick={e => addKind()}>إضافة</AddButton>
        </div>
      }
    >
      <Head title="تفاصيل الخدمات" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
            {success}
          </div>)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200">
                  <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      {/* <TableHeading
                        name='id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        ID
                      </TableHeading> */}
                      <TableHeading
                        name='name'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        تفاصيل الخدمات
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
                      {/* <th className="px-3 py-3"></th> */}
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.name}
                          placeholder="تفاصيل الخدمات"
                          onBlur={e => searchFieldChanged('name', e.target.value)}
                          onKeyPress={e => onKeyPress('name', e)}
                        >
                        </TextInput>
                      </th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {kinds.data.map((kind) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={kind.id}>
                        {/* <td className="px-3 py-2">{kind.id}</td> */}
                        <td className="px-3 py-2 text-nowrap">{kind.name}</td>
                        <td className="px-3 py-2 text-nowrap">
                          <PrimaryButton onClick={e => editKind(kind)}>تعديل</PrimaryButton>
                          <DeleteButton onClick={e => deleteKind(kind)}>حذف</DeleteButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={kinds.meta.links} queryParams={queryParams} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
