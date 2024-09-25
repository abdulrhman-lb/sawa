import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { ORDER_CLASS_MAP, ORDER_TEXT_MAP } from "@/constants";
import { useState } from "react";
import SearchableDropdown from "@/Components/SearchableDropdown";
import Modal from "@/Components/Modal";
import RejectButton from "@/Components/Buttons/RejectButton copy";
import AcceptButton from "@/Components/Buttons/AcceptButton";
import InputError from "@/Components/InputError";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import WarningMessage from "@/Components/WarningMessage";
import DeleteButton from "@/Components/Buttons/DeleteButton";
import AddButton from "@/Components/Buttons/AddButton";
import Title from "@/Components/Title";

export default function index({ auth, users, message, category_permissions, queryParams = null, success }) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");

  queryParams = queryParams || {}

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
    router.get(route('category-permission.index'), queryParams)
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
    router.get(route('category-permission.index'), queryParams)
  }

  const deleteCategoryPermission = (category_permission) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذا صلاحية التصنيف لهذا المركز ؟')) {
      return;
    }
    router.post(route('category-permission.destroy', category_permission.id),{
      _method: 'DELETE',
    })
  }

  const addCategoryPermission = () => {
    router.get(route("category-permission.create"))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <Title>صلاحيات التصنيفات</Title>
          <ScrollBar message={message} />
          <AddButton onClick={e => addCategoryPermission()}>إضافة</AddButton>
        </div>
      }
    >
      <Head title="الطلبات قيد المعالجة" />

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
                        name='user_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المركز
                      </TableHeading>
                      <TableHeading
                        sortable={false}
                      >
                        التصنيف
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
                      <th className="px-3 py-3 relative">
                        <SearchableDropdown
                          items={users.data}
                          name="user_id"
                          selectedItem={users.data.find((user) => user.id === queryParams.user_id)}
                          onSelectItem={handleSelectUser}
                          placeholder="اختر المركز"
                          queryParams={queryParams}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {category_permissions.data.map((category_permission) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={category_permission.id}>
                        <td className="px-3 py-2">{category_permission.user.name}</td>
                        <td className="px-3 py-2">{category_permission.category.name}</td>
                        <td className="px-3 py-2 text-nowrap">
                          <DeleteButton onClick={e => deleteCategoryPermission(category_permission)}>حذف</DeleteButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={category_permissions.meta.links} queryParams={queryParams} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}