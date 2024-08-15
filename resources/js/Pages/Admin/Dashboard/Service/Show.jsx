import { STATUS_CLASS_MAP, STATUS_TEXT_MAP } from "@/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, service }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {`الخدمة : ${service.name}`}
          </h2>
          <Link href={route('service.edit', service.id)} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
            تعديل
          </Link>
        </div>
      }
    >
      <Head title='الخدمات' />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="grid gap-1 grid-cols-2 mt-2">
                <div>
                  <div className="mt-4">
                    <label className="text-lg">اسم الخدمة</label>
                    <p className="mt-1">{service.name}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg">المنتج</label>
                    <p className="mt-1 hover:underline text-gray-100">
                      <Link href={route("category.show", service.product_id)}>
                        {service.product.name}
                      </Link>
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg">الحالة</label>
                    <p className="mt-1">
                      <span className={"px-2 py-1 rounded text-white text-nowrap " +
                        STATUS_CLASS_MAP[service.status]} >
                        {STATUS_TEXT_MAP[service.status]}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <div className="mt-4">
                    <label className="text-lg">نوع البيانات الأول</label>
                    <p className="mt-1">{service.data_1.name}</p>
                  </div>
                  <div className="mt-4">
                    <label className=" text-lg">نوع البيانات الثاني</label>
                    <p className="mt-1">{(service.data_kind_id_2) && (service.data_2.name)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-lg">ملاحظات</label>
                <p className="mt-1">{service.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
