import AcceptButton from "@/Components/Buttons/AcceptButton";
import RejectButton from "@/Components/Buttons/RejectButton copy";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";


export default function Create({ auth }) {
  const { data, setData, post, errors, reset } = useForm({
    amount: '',
    statment: '',
  })

  const [amoutError, setAmountError] = useState('');
  const [statmentError, setStatmentError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (data.amount <= 0) {
      setAmountError("يجب أن تكون القيمة أكبر تماما من الصفر");
    } else {
      setAmountError('');
    }
    if (data.statment === "") {
      setStatmentError("يرجى إدخال بيان النفقات أو المصاريف");
    } else {
      setStatmentError('');
    }
    if ((data.amount > 0) && (data.statment != "")) {
      post(route("box.store"))
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            إضافة نفقات ومصاريف
          </h2>
        </div>
      }
    >
      <Head title="نفقات ومصاريف" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div>
                <InputLabel
                  htmlFor="amount"
                  value="المبلغ"
                />
                <TextInput
                  id="amount"
                  type="number"
                  name="amount"
                  value={data.amount}
                  isFocused={true}
                  className="mt-1 block w-full"
                  onChange={e => setData('amount', e.target.value)}
                />
                <InputError message={errors.amount} className="mt-2" />
                <InputError message={amoutError} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="statment"
                  value="البيان"
                />
                <TextAreaInput
                  id="statment"
                  name="statment"
                  value={data.statment}
                  className="mt-1 block w-full"
                  onChange={e => setData('statment', e.target.value)}
                />
                <InputError message={errors.statment} className="mt-2" />
                <InputError message={statmentError} className="mt-2" />
              </div>
              <div className="mt-4 text-right ">
                <AcceptButton className="w-28 justify-center">موافق</AcceptButton>
                <Link href={route('box.index')} >
                <RejectButton className="w-28 justify-center">إلغاء الأمر</RejectButton>

                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
