import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useState } from "react";
import SearchableDropdown from "@/Components/SearchableDropdown";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import AddButton from "@/Components/Buttons/AddButton";
import DetailsButton from "@/Components/Buttons/DetailsButton";
import AcceptButton from "@/Components/Buttons/AcceptButton";
import RejectButton from "@/Components/Buttons/RejectButton copy";
import InputError from "@/Components/InputError";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import { FaBorderNone } from "react-icons/fa";
import { MdAccountTree } from "react-icons/md";
import SelectInput from "@/Components/SelectInput";

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
  message,
  success,
  initialNotifications
 }) {
  queryParams = queryParams || {}

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [add, setAdd] = useState(0);
  const [statment, setStatment] = useState(null);
  const [addError, setAddError] = useState('');

  const openAddModal = (product_balance) => {
    setSelectedProduct(product_balance);
    setShowAddModal(true);
  }

  const openDetails = (product_balance) => {
    router.get(route('product-balance.index', { product_id: product_balance.product.id }));
  }

  const handleAdd = () => {
    if (add <= 0) {
      setAddError('القيمة يجب أن تكون أكبر من الصفر');
    } else {
      setAddError('');
    }
    if ((add > 0)) {
      router.post(route('product-balance.store'), {
        product_id: selectedProduct.product.id,
        add: add,
        reduce: 0,
        profit: 0,
        statment: statment || '-',
      });
      setShowAddModal(false);
      setStatment('');
      setAdd(0);
      setAddError(0);
    }
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

  const colChanged = (name, value) => {
    queryParams[name] = value;
    queryParams.page = 1;
    router.get(route('product.balances.home'), queryParams)
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      notification={initialNotifications}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <MdAccountTree className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              أرصدة المنتجات
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title="أرصدة المنتجات" />
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="md">
        <div className="p-6 dark:text-white text-gray-900">
          <h2 className="text-lg font-medium">إضافة رصيد منتج : {(selectedProduct && selectedProduct.product.category.name + " / " + selectedProduct.product.name)}</h2>
          <p className="mt-4">أدخل القيمة التي تريد شحن رصيد المنتج بها</p>
          <div>
            <TextInput
              type="number"
              className="mt-4"
              placeholder="المبلغ"
              value={add}
              onChange={(e) => setAdd(e.target.value)}
              lang="en"
            />
          </div>
          <InputError message={addError} className="mt-2" />
          <div>
            <TextInput
              className="mt-4"
              placeholder="البيان"
              value={statment}
              onChange={(e) => setStatment(e.target.value)}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <AcceptButton onClick={handleAdd}>موافق</AcceptButton>
            <RejectButton onClick={() => (setShowAddModal(false), setAdd(0), setStatment(''))}>إلغاء</RejectButton>
          </div>
        </div>
      </Modal>
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
                        name='category_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        التصنيف
                      </TableHeading>
                      <TableHeading
                        name='name'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المنتج
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        ايداع
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        سحب
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        الرصيد الصافي
                      </TableHeading>
                      <TableHeading
                        sortable={false}
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
                    {product_balances.data.map((product_balance, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={product_balance.product.id}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{product_balance.product.category.name}</td>
                        <td className="px-3 py-2">{product_balance.product.name}</td>
                        <td className="px-3 py-2">{product_balance.total_add.toLocaleString('en-US')}</td>
                        <td className="px-3 py-2">{product_balance.total_reduce.toLocaleString('en-US')}</td>
                        <td className="px-3 py-2">{product_balance.final_balance}</td>
                        <td className="px-3 py-2">{product_balance.total_profit}</td>
                        <td className="px-3 py-2 text-nowrap">
                          {(product_balance.total_add === 0 && product_balance.total_reduce === 0) ?
                            (
                              <DetailsButton disabled={true} onClick={() => openDetails(product_balance)}>عرض التفاصيل</DetailsButton>
                            )
                            : (
                              <DetailsButton onClick={() => openDetails(product_balance)}>عرض التفاصيل</DetailsButton>
                            )}
                          <AddButton onClick={() => openAddModal(product_balance)}>إضافة رصيد</AddButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-center">
                    <tr>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">المجموع</th>
                      <th className="px-3 py-3">{total_add_all}</th>
                      <th className="px-3 py-3">{total_reduce_all}</th>
                      <th className="px-3 py-3">{final_balance_all}</th>
                      <th className="px-3 py-3">{total_profit_all}</th>
                    </tr>
                  </tfoot>
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
                  <Pagination links={product_balances.links} queryParams={queryParams} />
                </div>
                <div className="mt-4">
                  <h3>إجمالي السجلات : {product_balances.data.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
