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
  product_balances,
  categories,
  products,
  total_add_all,
  total_reduce_all,
  total_profit_all,
  final_balance_all,
  queryParams = null,
  success }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [add, setAdd] = useState(0);
  const [statment, setStatment] = useState(null);
  queryParams = queryParams || {}

  const openAddModal = (product_balance) => {
    setSelectedProduct(product_balance);
    setShowAddModal(true);
  }

  const openDetails = (product_balance) => {
    router.get(route('product-balance.index'), product_balance.product);
  }

  const handleAdd = () => {
    router.post(route('product-balance.store'), {
      product_id: selectedProduct.product.id,
      add: add,
      reduce: 0,
      profit: 0,
      statment: statment,
    });
    setShowAddModal(false);
    setStatment('');
    setAdd(0);
  }

  const handleSelectProduct = (selectedProduct) => {
    searchFieldChanged('product_id', selectedProduct.id);
  };

  const handleSelectCategory = (selectedCategory) => {
    searchFieldChanged('category_id', selectedCategory.id);
  };

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    queryParams.page = 1;
    router.get(route('product.balances.home'), queryParams);
  };

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
            أرصدة المنتجات
          </h2>
        </div>
      }
    >
      <Head title="أرصدة المنتجات" />

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">إضافة رصيد منتج</h2>
          <p className="mt-4">أدخل القيمة التي تريد شحن رصيد المنتج بها</p>
          <div>
          <TextInput
            type="number"
            className="mt-4"
            placeholder="المبلغ"
            value={add}
            onChange={(e) => setAdd(e.target.value)}
          />
          </div>
          <div>
          <TextInput
            className="mt-4"
            placeholder="البيان"
            value={statment}
            onChange={(e) => setStatment(e.target.value)}
          />
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleAdd} className="bg-token1 dark:bg-token2 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">موافق</button>
            <button onClick={() => (setShowAddModal(false), setAdd(0), setStatment(''))} className="bg-gray-300 mx-4 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200">إلغاء</button>
          </div>
        </div>
      </Modal>
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
                        ID
                      </TableHeading>
                      <TableHeading
                        name='category'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        التصنيف
                      </TableHeading>
                      <TableHeading
                        name='product.name'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المنتج
                      </TableHeading>
                      <TableHeading
                        name='total_add'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        ايداع
                      </TableHeading>
                      <TableHeading
                        name='total_reduce'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        سحب
                      </TableHeading>
                      <TableHeading
                        name='final_balance'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        الرصيد الصافي
                      </TableHeading>
                      <TableHeading
                        name='profit'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        صافي الربح
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
                          items={categories.data}
                          name="category_id"
                          selectedItem={categories.data.find((category) => category.id === queryParams.category_id)}
                          onSelectItem={handleSelectCategory}
                          placeholder="اختر التصنيف"
                          queryParams={queryParams}
                        />
                      </th>
                      <th className="px-3 py-3 relative">
                        <SearchableDropdown
                          items={products.data}
                          name="product_id"
                          selectedItem={products.data.find((product) => product.id === queryParams.product_id)}
                          onSelectItem={handleSelectProduct}
                          placeholder="اختر المنتج"
                          queryParams={queryParams}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {product_balances.data.map((product_balance) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={product_balance.product.id}>
                        <td className="px-3 py-2">{product_balance.product.id}</td>
                        <td className="px-3 py-2">{product_balance.product.category.name}</td>
                        <td className="px-3 py-2">{product_balance.product.name}</td>
                        <td className="px-3 py-2">{product_balance.total_add}</td>
                        <td className="px-3 py-2">{product_balance.total_reduce}</td>
                        <td className="px-3 py-2">{product_balance.final_balance}</td>
                        <td className="px-3 py-2">{product_balance.total_profit}</td>
                        <td className="px-3 py-2 text-nowrap">
                          <button onClick={() => openDetails(product_balance)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">عرض التفاصيل</button>
                          <button onClick={() => openAddModal(product_balance)} className="font-medium text-green-600 dark:text-green-500 hover:underline mx-1">إضافة رصيد</button>
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
              <Pagination links={product_balances.links} queryParams={queryParams} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
