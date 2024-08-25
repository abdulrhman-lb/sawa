import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useState } from "react";
import SearchableDropdown from "@/Components/SearchableDropdown";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";

export default function index({
  auth,
  product_balance,
  total_add_all,
  total_reduce_all,
  total_profit_all,
  final_balance_all,
  queryParams = null,
  success }) {

  queryParams = queryParams || {}
  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }
    queryParams.page = 1;
    router.get(route('product.balances.home'), queryParams);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            حركة رصيد المنتج: {product_balance.data[0].product.category.name} / {product_balance.data[0].product.name}
            {/* {JSON.stringify(product_balance)} */}
          </h2>
        </div>
      }
    >
      <Head title="حركة رصيد منتج" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
            {success}
          </div>)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm justify-center text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500 text-center">
                    <tr className="text-nowrap">
                      <TableHeading
                        name='id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        التاريخ
                      </TableHeading>
                      <TableHeading
                        name='category'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        حركات الايداع
                      </TableHeading>
                      <TableHeading
                        name='product.name'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        حركات السحب
                      </TableHeading>
                      <TableHeading
                        name='total_add'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        الربح
                      </TableHeading>
                      <TableHeading
                        name='total_reduce'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        البيان
                      </TableHeading>
                      <TableHeading
                        name='final_balance'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        التفاصيل
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        التحكم
                      </TableHeading>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {product_balance.data.map((product_balanc) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={product_balanc.id}>
                        <td className="px-3 py-2">{product_balanc.created_at}</td>
                        <td className="px-3 py-2">{product_balanc.add}</td>
                        <td className="px-3 py-2">{product_balanc.reduce}</td>
                        <td className="px-3 py-2">{product_balanc.profit}</td>
                        <td className="px-3 py-2">{product_balanc.statment}</td>
                        <td className="px-3 py-2">{product_balanc.order ? (product_balanc.order.user.name + " / " + product_balanc.order.service.name + " / " + product_balanc.order.amount_kind.kindName.name) : '-'}</td>
                        <td className="px-3 py-2 text-nowrap">
                          {!product_balanc.order ? (
                            <>
                              <button onClick={() => openDetails(product_balanc)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">تعديل</button>
                              <button onClick={() => openAddModal(product_balanc)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">حذف</button>
                            </>
                          ) : (
                            <span className="font-medium text-gray-600 dark:text-gray-500 mx-1">لا يمكن التعديل</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-center">
                    <th className="px-3 py-3"></th>
                    <th className="px-3 py-3"></th>
                    <th className="px-3 py-3"></th>
                    <th className="px-3 py-3">{total_add_all}</th>
                    <th className="px-3 py-3">{total_reduce_all}</th>
                    <th className="px-3 py-3">{final_balance_all}</th>
                    <th className="px-3 py-3">{total_profit_all}</th>
                  </tfoot>
                </table>
              </div>
              <Pagination links={product_balance.meta.links} queryParams={queryParams} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
