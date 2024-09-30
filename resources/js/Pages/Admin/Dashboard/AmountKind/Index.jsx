import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { KIND_DATA_TEXT_MAP, STATUS_CLASS_MAP, STATUS_TEXT_MAP } from "@/constants";
import { useState } from "react";
import SearchableDropdown from "@/Components/SearchableDropdown";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DeleteButton from "@/Components/Buttons/DeleteButton";
import AddButton from "@/Components/Buttons/AddButton";
import ScrollBar from "@/Components/ScrollBar";
import SuccessMessage from "@/Components/SuccessMessage";
import Title from "@/Components/Title";
import { PiCashRegisterThin } from "react-icons/pi";

export default function index({ auth, amount_kinds, services, kinds, queryParams = null, success, message, initialNotifications }) {
  queryParams = queryParams || {}

  const handleSelectKind = (selectedKind) => {
    searchFieldChanged('kind_id', selectedKind.id);
  };

  const handleSelectService = (selectedService) => {
    searchFieldChanged('service_id', selectedService.id);
  };

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    queryParams.page = 1;
    router.get(route('amountkind.index'), queryParams)
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
    router.get(route('amountkind.index'), queryParams)
  }

  const colChanged = (name, value) => {
    queryParams[name] = value;
    queryParams.page = 1;
    router.get(route('amountkind.index'), queryParams)
  }

  const deleteAmountKind = (amount_kind) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذا السعر؟')) {
      return;
    }
    router.post(route('amountkind.destroy', amount_kind.id), {
      _method: 'DELETE',
    })
  }

  const editAmountKind = (amount_kind) => {
    router.get(route("amountkind.edit", amount_kind))
  }

  const addAmountKind = () => {
    router.get(route("amountkind.create"))
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
              <PiCashRegisterThin className="ml-4 -mx-1 rounded-full border-4 size-7 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400" />
              أسعار المنتجات
            </Title>
            <AddButton onClick={e => addAmountKind()}>إضافة</AddButton>
          </ScrollBar>
        </div>
      }
    >
      <Head title="أسعار المنتجات" />
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
                        name='service_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        الخدمة
                      </TableHeading>
                      <TableHeading
                        name='kind_id'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        تفاصيل الخدمة
                      </TableHeading>
                      <TableHeading
                        name='kind'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        طريقة الحساب
                      </TableHeading>
                      <TableHeading
                        name='amount'
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        السعر
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
                          items={services.data}
                          name="service_id"
                          selectedItem={services.data.find((service) => service.id === queryParams.service_id)}
                          onSelectItem={handleSelectService}
                          placeholder="اختر الخدمة"
                          queryParams={queryParams}
                        />
                      </th>
                      <th className="px-3 py-3 relative">
                        <SearchableDropdown
                          items={kinds.data}
                          name="kind_id"
                          selectedItem={kinds.data.find((kind) => kind.id === queryParams.kind_id)}
                          onSelectItem={handleSelectKind}
                          placeholder="اختر تفاصيل الخدمة"
                          queryParams={queryParams}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {amount_kinds.data.map((amount_kind, index) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={amount_kind.id}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{amount_kind.service.product.name} - {amount_kind.service.name}</td>
                        <td className="px-3 py-2">{(amount_kind.kind_id != null ? amount_kind.kindName.name : null)}</td>
                        <td className="px-3 py-2">{KIND_DATA_TEXT_MAP[amount_kind.kind]}</td>
                        <td className="px-3 py-2">{amount_kind.amount}</td>
                        <td className="px-3 py-2 text-nowrap">
                          <PrimaryButton onClick={e => editAmountKind(amount_kind)}>تعديل</PrimaryButton>
                          <DeleteButton onClick={e => deleteAmountKind(amount_kind)}>حذف</DeleteButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
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
                  <Pagination links={amount_kinds.meta.links} queryParams={queryParams} />
                </div>
                <div className="mt-4">
                  <h3>إجمالي السجلات : {amount_kinds.data.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout >
  );
}
