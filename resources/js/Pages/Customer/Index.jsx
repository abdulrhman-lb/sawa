import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import SelectInput from "@/Components/SelectInput";
import { KIND_CLASS_MAP, KIND_TEXT_MAP, STATUS_CLASS_MAP, STATUS_TEXT_MAP } from "@/constants";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DeleteButton from "@/Components/Buttons/DeleteButton";
import AddButton from "@/Components/Buttons/AddButton";

export default function index({ auth, customers, queryParams = null, success }) {
  queryParams = queryParams || {}
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    router.get(route('customer.index'), queryParams)
  }

  const onKeyPress = (name, e) => {
    if (e.key !== 'Enter') return;
    searchFieldChanged(name, e.target.value);
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
    router.get(route('customer.index'), queryParams)
  }

  const deleteCustomer = (customer) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذا الزبون؟')) {
      return;
    }
    router.delete(route('customer.destroy', customer.id))
  }

  const editCustomer = (customer) => {
    router.get(route("customer.edit", customer))
  }

  const addCustomer = () => {
    router.get(route("customer.create"))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            الزبائن
          </h2>
          <AddButton onClick={e => addCustomer()}>إضافة</AddButton>
        </div>
      }
    >
      <Head title="الزبائن" />
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
                        الاسم الزبون
                      </TableHeading>
                      <TableHeading
                        name='email'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        رقم الموبايل
                      </TableHeading>
                      <TableHeading
                        name='center'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        رقم الهاتف
                      </TableHeading>
                      <TableHeading
                        name='kind'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        ملاحظات
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
                          placeholder="اسم الزبون"
                          onBlur={e => searchFieldChanged('name', e.target.value)}
                          onKeyPress={e => onKeyPress('name', e)}
                        >
                        </TextInput>
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {customers.data.map((customer) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={customer.id}>
                        {/* <td className="px-3 py-2">{customer.id}</td> */}
                        <td className="px-3 py-2 text-nowrap">{customer.name}</td>
                        <td className="px-3 py-2">{customer.mobile}</td>
                        <td className="px-3 py-2">{customer.phone}</td>
                        <td className="px-3 py-2">{customer.notes}</td>
                        <td className="px-3 py-2 text-nowrap">
                          <PrimaryButton onClick={e => editCustomer(customer)}>تعديل</PrimaryButton>
                          <DeleteButton onClick={e => deleteCustomer(customer)}>حذف</DeleteButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={customers.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
