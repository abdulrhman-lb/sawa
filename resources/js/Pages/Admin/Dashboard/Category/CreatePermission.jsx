import AcceptButton from "@/Components/Buttons/AcceptButton";
import RejectButton from "@/Components/Buttons/RejectButton copy";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import ScrollBar from "@/Components/ScrollBar";
import SearchableDropdownForm from "@/Components/SearchableDropdownForm";
import SuccessMessage from "@/Components/SuccessMessage";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import Title from "@/Components/Title";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Create({ auth, categories, users, message, success }) {
  const { data, setData, post, errors, reset } = useForm({
    user_id: '',
    category_id: '',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("category-permission.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      message={message}
      header={
        <div className="flex justify-between items-center">
          <Title>إنشاء صلاحيات جديدة</Title>
          <ScrollBar message={message} />
        </div>
      }
    >
      <Head title="صلاحيات التصنيفات" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {success && (<SuccessMessage message={success} />)}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className=" p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="grid lg:grid-cols-3 sm:grid-cols-1">
                <div className="px-3">
                  <InputLabel
                    htmlFor="category_id"
                    value="التصنيف"
                  />
                  <SearchableDropdownForm
                    items={categories.data}
                    value={data.category_id}
                    onChange={(value) => setData('category_id', value)}
                    placeholder="اختر التصنيف"
                    labelKey="name"
                    valueKey="id"
                  />
                  <InputError message={errors.category_id} className="mt-2" />
                </div>
                <div className="px-3">
                  <InputLabel
                    htmlFor="user_id"
                    value="المركز"
                  />
                  <SearchableDropdownForm
                    items={users.data}
                    value={data.user_id}
                    onChange={(value) => setData('user_id', value)}
                    placeholder="اختر المركز"
                    labelKey="name"
                    valueKey="id"
                  />
                  <InputError message={errors.user_id} className="mt-2" />
                </div>
                <div className="mt-7 px-3 text-center">
                  <AcceptButton className="w-28 justify-center">موافق</AcceptButton>
                  <Link href={route('category-permission.index')} >
                    <RejectButton className="w-28 justify-center">إلغاء الأمر</RejectButton>
                  </Link>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
