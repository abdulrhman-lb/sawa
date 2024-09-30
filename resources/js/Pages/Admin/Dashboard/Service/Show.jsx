import ScrollBar from "@/Components/ScrollBar";
import Title from "@/Components/Title";
import { STATUS_CLASS_MAP, STATUS_TEXT_MAP } from "@/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { GrServicePlay } from "react-icons/gr";


export default function Show({ 
  auth, 
  service, 
  message, 
  initialNotifications
 }) {
  
  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      notification={initialNotifications}
      header={
        <div className="flex justify-between items-center">
          <ScrollBar message={message}>
            <Title className="flex">
              <GrServicePlay className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              {`الخدمة : ${service.name}`}
            </Title>
            <Link href={route('service.edit', service.id)} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
              تعديل
            </Link>
          </ScrollBar>
        </div>
      }
    >
      <Head title='الخدمات' />
      <div className="py-2">
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
