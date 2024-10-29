import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { FaRegSave } from "react-icons/fa";
import { SiAuthelia } from "react-icons/si";

export default function EditPermission({
  auth,
  category_permissions,
  message,
  success,
}) {
  const { data, setData, post, errors, processing, reset } = useForm({
    permissions: category_permissions.data.map((permission) => ({
      category_id: permission.category_id,
      status: permission.status,
    })),
    _method: 'PUT'
  });

  const handleCheckboxChange = (index) => {
    const updatedPermissions = [...data.permissions];
    updatedPermissions[index].status = !updatedPermissions[index].status;
    setData("permissions", updatedPermissions);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("category-permission.update", category_permissions.data[0].user_id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message} >
            <Title className="flex">
              <SiAuthelia className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              صلاحيات المستخدم
            </Title>
          </ScrollBar>
        </div>
      }
    >
      <Head title={`صلاحيات المستخدم: `} />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (<SuccessMessage message={success} />)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className='p-6'>
              <form onSubmit={onSubmit}>
                {data.permissions.map((category_permission, index) => (
                  <div key={category_permission.category_id}>
                    <div className="flex items-center ps-3 my-2">
                      <input
                        type="checkbox"
                        checked={category_permission.status}
                        onChange={() => handleCheckboxChange(index)} // عند تغيير حالة checkbox
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        className="w-full py-3 ms-2 text-xl font-medium text-gray-900 dark:text-gray-300 text-nowrap"
                      >
                        {category_permissions.data[index].category.name}
                      </label>
                    </div>
                  </div>
                ))}
                <button
                  disabled={processing}
                  type="submit"
                  className="inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-2.5 py-1.5 text-center me-2">
                  حفظ التعديلات
                  <FaRegSave style={{ marginRight: '8px', marginTop: '3px' }} size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
