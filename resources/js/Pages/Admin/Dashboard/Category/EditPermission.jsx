import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { SiAuthelia } from "react-icons/si";

export default function EditPermission({ 
  auth, 
  category_permissions, 
  message, 
  success, 
  initialNotifications
 }) {
  const { data, setData, post, errors, reset } = useForm({
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
      notification={initialNotifications}
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
                  type="submit"
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  حفظ التعديلات
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
