import { STATUS_CLASS_MAP, STATUS_TEXT_MAP } from "@/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, category }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {`التصنيف: ${category.name}`}
          </h2>
          <Link href={route('category.edit', category.id)} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
            تعديل
          </Link>
        </div>
      }
    >
      <Head title="التصنيفات" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div>
              <img src={category.image} alt="" className="w-full h-64 object-cover" />
            </div>
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="grid gap-1 grid-cols-2 mt-2">
                <div>
                  <div className="mt-4">
                    <label className="text-lg">اسم التصنيف</label>
                    <p className="mt-1">{category.name}</p>
                  </div>
                </div>
                <div>
                  <div className="mt-4">
                    <label className="text-lg">الحالة</label>
                    <p className="mt-1">
                      <span className={"px-2 py-1 rounded text-white text-nowrap " +
                        STATUS_CLASS_MAP[category.status]} >
                        {STATUS_TEXT_MAP[category.status]}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-lg">ملاحظات</label>
                <p className="mt-1">{category.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
