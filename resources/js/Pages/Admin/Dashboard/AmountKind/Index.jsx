import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { KIND_DATA_TEXT_MAP, STATUS_CLASS_MAP, STATUS_TEXT_MAP } from "@/constants";
import { useState } from "react";
import SearchableDropdown from "@/Components/SearchableDropdown";

export default function index({ auth, amount_kinds, services, kinds, queryParams = null, success }) {
  queryParams = queryParams || {}

  const handleSelectKind = (selectedKind) => {
    searchFieldChanged('kind_id', selectedKind.id);
  };

  const handleSelectService = (selectedService) => {
    searchFieldChanged('service_id', selectedService.id);
  };

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    queryParams.page = 1;
    router.get(route('amountkind.index'), queryParams)
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
    router.get(route('amountkind.index'), queryParams)
  }

  const deleteAmountKind = (product) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذا السعر؟')) {
      return;
    }
    router.delete(route('amountkind.destroy', product.id))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            أسعار المنتجات
          </h2>
          <Link href={route('amountkind.create')} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
            إضافة
          </Link>
        </div>
      }
    >
      <Head title="أسعار المنتجات" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
            {success}
          </div>)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm justify-center text-center text-gray-500 dark:text-gray-400">
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
                        name='service_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        الخدمة
                      </TableHeading>
                      <TableHeading
                        name='kind_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        تفاصيل الخدمة
                      </TableHeading>
                      <TableHeading
                        name='kind'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        طريقة الحساب
                      </TableHeading>
                      <TableHeading
                        name='amount'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        السعر
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
                          items={services.data}
                          name="service_id"
                          selectedItem={services.data.find((service) => service.id === queryParams.service_id)}
                          onSelectItem={handleSelectService}
                          placeholder="اختر الخدمة"
                          queryParams={queryParams}
                        />
                      </th>
                      <th className="px-3 py-3 relative">
                        <SearchableDropdown
                          items={kinds.data}
                          name="kind_id"
                          selectedItem={kinds.data.find((kind) => kind.id === queryParams.kind_id)}
                          onSelectItem={handleSelectKind}
                          placeholder="اختر تفاصيل الخدمة"
                          queryParams={queryParams}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {amount_kinds.data.map((amount_kind) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={amount_kind.id}>
                        <td className="px-3 py-2">{amount_kind.id}</td>
                        <td className="px-3 py-2">{amount_kind.service.product.name} - {amount_kind.service.name}</td>
                        <td className="px-3 py-2">{(amount_kind.kind_id != null ? amount_kind.kindName.name : null)}</td>
                        <td className="px-3 py-2">{KIND_DATA_TEXT_MAP[amount_kind.kind]}</td>
                        <td className="px-3 py-2">{amount_kind.amount}</td>
                        <td className="px-3 py-2 text-nowrap">
                          <Link href={route("amountkind.edit", amount_kind)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                            تعديل
                          </Link>
                          <button
                            onClick={e => deleteAmountKind(amount_kind)}
                            className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={amount_kinds.meta.links} queryParams={queryParams} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}