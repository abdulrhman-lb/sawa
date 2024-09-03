import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import SelectInput from "@/Components/SelectInput";
import { KIND_CLASS_MAP, KIND_TEXT_MAP, STATUS_CLASS_MAP, STATUS_TEXT_MAP } from "@/constants";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import AddButton from "@/Components/Buttons/AddButton";

export default function index({ auth, admins, users, queryParams = null, success }) {
  queryParams = queryParams || {}
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    router.get(route('user.index'), queryParams)
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
    router.get(route('user.index'), queryParams)
  }

  const deleteUser = (user) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    router.delete(route('user.destroy', user.id))
  }
  
  const editUser = (user) => {
    router.get(route("user.edit", user))
  }

  const addUser = () => {
    router.get(route("user.create"))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            المستخدمين
          </h2>
          <AddButton onClick={e => addUser()}>إضافة</AddButton>
        </div>
      }
    >
      <Head title="المستخدمين" />
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
                        الاسم الكامل
                      </TableHeading>
                      <TableHeading
                        name='email'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        البريد الالكتروني
                      </TableHeading>
                      <TableHeading
                        name='center'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المركز
                      </TableHeading>
                      <TableHeading
                        name='kind'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        نوع الحساب
                      </TableHeading>
                      <TableHeading
                        name='status'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        حالة الحساب
                      </TableHeading>
                      <TableHeading
                        name='created_at'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        المسؤول
                      </TableHeading>
                      <TableHeading
                        name='created_at'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        تاريخ الإنشاء
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
                          placeholder="الاسم الكامل"
                          onBlur={e => searchFieldChanged('name', e.target.value)}
                          onKeyPress={e => onKeyPress('name', e)}
                        >
                        </TextInput>
                      </th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.email}
                          placeholder="البريد الالكتروني"
                          onBlur={e => searchFieldChanged('email', e.target.value)}
                          onKeyPress={e => onKeyPress('email', e)}
                        >
                        </TextInput>
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <SelectInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.kind}
                          onChange={e => searchFieldChanged('kind', e.target.value)}
                        >
                          <option value="">اختر نوع الحساب</option>
                          <option value="admin">مدير نظام</option>
                          <option value="super_user">مركز توزيع</option>
                          <option value="user">مركز بيع</option>
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3">
                        <SelectInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.status}
                          onChange={e => searchFieldChanged('status', e.target.value)}
                        >
                          <option value="">اختر الحالة</option>
                          <option value="active">فعال</option>
                          <option value="inactive">غير فعال</option>
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3">
                        <SelectInput
                          className="w-full text-sm font-medium"
                          defaultValue={queryParams.created_by}
                          onChange={e => searchFieldChanged('created_by', e.target.value)}
                        >
                          <option value="">اختر المسؤول</option>
                          {admins.map((admin) => (
                            <option key={admin.id} value={admin.id}>{admin.name}</option>
                          ))}
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {users.data.map((user) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.id}>
                        {/* <td className="px-3 py-2">{user.id}</td> */}
                        <td className="px-3 py-2 text-nowrap">{user.name}</td>
                        <td className="px-3 py-2">{user.email}</td>
                        <td className="px-3 py-2">{user.center}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={" px-2 py-0 cursor-pointer rounded text-white text-nowrap " +
                            KIND_CLASS_MAP[user.kind]} >
                            {KIND_TEXT_MAP[user.kind]}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={"px-2 py-0 cursor-pointer rounded text-white text-nowrap " +
                            STATUS_CLASS_MAP[user.status]} >
                            {STATUS_TEXT_MAP[user.status]}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-nowrap">{user.createdBy}</td>
                        <td className="px-3 py-2 text-nowrap">{user.created_at}</td>
                        <td className="px-3 py-2 text-nowrap">
                        <PrimaryButton onClick={e => editUser(user)}>تعديل</PrimaryButton>
                          {/* <button
                            onClick={e => deleteUser(user)}
                            className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                            حذف
                          </button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={users.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
