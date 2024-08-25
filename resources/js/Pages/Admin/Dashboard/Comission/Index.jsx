import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { KIND_DATA_TEXT_MAP, STATUS_CLASS_MAP, STATUS_TEXT_MAP } from "@/constants";
import { useState } from "react";
import SearchableDropdown from "@/Components/SearchableDropdown";

export default function index({ auth, comissions, users, admins, queryParams = null, success }) {
  queryParams = queryParams || {}

  const handleSelectOfficer = (selectedOfficer) => {
    searchFieldChanged('officer_id', selectedOfficer.id);
  };

  const handleSelectUser = (selectedUser) => {
    searchFieldChanged('user_id', selectedUser.id);
  };

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    queryParams.page = 1;
    router.get(route('comission.index'), queryParams)
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
    router.get(route('comission.index'), queryParams)
  }

  const deleteComission = (product) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذا العمولة؟')) {
      return;
    }
    router.delete(route('comission.destroy', product.id))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            نسبة العمولة
          </h2>
          <Link href={route('comission.create')} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
            إضافة
          </Link>
        </div>
      }
    >
      <Head title="نسبة العمولة" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
            {success}
          </div>)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm justify-center text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <TableHeading
                        name='id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        ID
                      </TableHeading>
                      <TableHeading
                        name='user_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المستخدم
                      </TableHeading>
                      <TableHeading
                        name='amount_kind_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        تفاصيل الخدمة
                      </TableHeading>
                      <TableHeading
                        name='officer_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        عائدية العمولة
                      </TableHeading>
                      <TableHeading
                        name='comission'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        العمولة
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
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3 relative">
                        <SearchableDropdown
                          items={users.data}
                          name="user_id"
                          selectedItem={users.data.find((user) => user.id === queryParams.user_id)}
                          onSelectItem={handleSelectUser}
                          placeholder="اختر المستخدم"
                          queryParams={queryParams}
                        />
                      </th>
                      <th className="px-3 py-3"></th>

                      {/* {JSON.stringify(admins)} */}
                      <th className="px-3 py-3 relative">
                        <SearchableDropdown
                          items={admins}
                          name="officer_id"
                          selectedItem={admins.find((admin) => admin.id === queryParams.officer_id)}
                          onSelectItem={handleSelectOfficer}
                          placeholder="اختر عائدية العمولة"
                          queryParams={queryParams}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {comissions.data.map((comission) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={comission.id}>
                        <td className="px-3 py-2">{comission.id}</td>
                        <td className="px-3 py-2">{comission.user.name}</td>
                        <td className="px-3 py-2">{comission.amount_kind.service.product.category.name} / {comission.amount_kind.service.product.name} / {comission.amount_kind.service.name} / {comission.amount_kind.kindName.name} / السعر {comission.amount_kind.amount}</td>
                        <td className="px-3 py-2">{comission.officer.name}</td>
                        <td className="px-3 py-2" title={`العمولة: ${comission.comission_admin} %, عمولة التاجر: ${comission.comission_super}`}>{comission.comission_admin + comission.comission_super} %</td>
                        <td className="px-3 py-2 text-nowrap">
                          {(comission.officer_id === auth.user.id) ? (
                            <>
                              <Link href={route("comission.edit", comission.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                                تعديل
                              </Link>
                              <button
                                onClick={e => deleteComission(comission)}
                                className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                                حذف
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="font-medium text-gray-600 dark:text-gray-500 mx-1">ليس لديك صلاحيات</span>
                            </>
                          )}


                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={comissions.meta.links} queryParams={queryParams} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
