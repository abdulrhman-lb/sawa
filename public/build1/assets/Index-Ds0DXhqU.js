import{j as e,Y as _,y as a}from"./app-4CarAZae.js";import{P as N}from"./Pagination-CSCna3ch.js";import{T as m}from"./TextInput-DyNG2S4m.js";import{A as u}from"./AuthenticatedLayout-DlZAqirn.js";import{T as i}from"./TableHeading-2ju96-yK.js";import{S as o}from"./SelectInput-CHXUtI-C.js";import{c as b,d as v,S as w,a as y}from"./constants-CQw5BT4e.js";import{P as k}from"./PrimaryButton-D4siN8KF.js";import{A as S}from"./AddButton-Cj9YlLQU.js";import{S as T}from"./ScrollBar-2ExapV3B.js";import{S as A}from"./SuccessMessage-CL-2JUjC.js";import{T as C}from"./Title-Dy3FFUwd.js";import"./ApplicationLogo-Dv8uwSlW.js";import"./transition-B3zTIZ2S.js";import"./NavLink-Bq0O64v2.js";import"./DarkMode-Bf1Neqjf.js";import"./iconBase-TbwvlisU.js";import"./ResponsiveMenu-BnbI3YqC.js";import"./index-_Gq6pFcl.js";import"./Modal-DeS_P8Lr.js";import"./InputError-BzZEBFuT.js";function $({auth:h,admins:j,users:n,queryParams:s=null,success:c,message:x}){s=s||{};const l=(t,d)=>{d?s[t]=d:delete s[t],a.get(route("user.index"),s)},p=(t,d)=>{d.key==="Enter"&&l(t,d.target.value)},r=t=>{t===s.sort_field?s.sort_direction==="asc"?s.sort_direction="desc":s.sort_direction="asc":(s.sort_field=t,s.sort_direction="asc"),a.get(route("user.index"),s)},f=t=>{a.get(route("user.edit",t))},g=()=>{a.get(route("user.create"))};return e.jsxs(u,{user:h.user,message:x,header:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx(C,{children:"المراكز"}),e.jsx(T,{message:x}),e.jsx(S,{onClick:t=>g(),children:"إضافة"})]}),children:[e.jsx(_,{title:"المراكز"}),e.jsx("div",{className:"py-2",children:e.jsxs("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:[c&&e.jsx(A,{message:c}),e.jsx("div",{className:"bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg",children:e.jsxs("div",{className:"p-2 text-gray-900 dark:text-gray-100",children:[e.jsx("div",{className:"overflow-auto",children:e.jsxs("table",{className:"w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200",children:[e.jsx("thead",{className:"text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500",children:e.jsxs("tr",{className:"text-nowrap",children:[e.jsx(i,{name:"image",sortable:!1,children:"الصورة"}),e.jsx(i,{name:"name",sort_field:s.sort_field,sort_direction:s.sort_direction,sortChanged:r,children:"الاسم الكامل"}),e.jsx(i,{name:"email",sort_field:s.sort_field,sort_direction:s.sort_direction,sortChanged:r,children:"البريد الالكتروني"}),e.jsx(i,{name:"center",sort_field:s.sort_field,sort_direction:s.sort_direction,sortChanged:r,children:"المركز"}),e.jsx(i,{name:"kind",sort_field:s.sort_field,sort_direction:s.sort_direction,sortChanged:r,children:"نوع الحساب"}),e.jsx(i,{name:"status",sort_field:s.sort_field,sort_direction:s.sort_direction,sortChanged:r,children:"حالة الحساب"}),e.jsx(i,{name:"created_by",sort_field:s.sort_field,sort_direction:s.sort_direction,sortChanged:r,children:"المسؤول"}),e.jsx(i,{name:"created_at",sort_field:s.sort_field,sort_direction:s.sort_direction,sortChanged:r,children:"تاريخ الإنشاء"}),e.jsx(i,{sortable:!1,children:"التحكم"})]})}),e.jsx("thead",{className:"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500",children:e.jsxs("tr",{className:"text-nowrap",children:[e.jsx("th",{className:"px-3 py-3"}),e.jsx("th",{className:"px-3 py-3",children:e.jsx(m,{className:"w-full text-sm font-medium",defaultValue:s.name,placeholder:"الاسم الكامل",onBlur:t=>l("name",t.target.value),onKeyPress:t=>p("name",t)})}),e.jsx("th",{className:"px-3 py-3",children:e.jsx(m,{className:"w-full text-sm font-medium",defaultValue:s.email,placeholder:"البريد الالكتروني",onBlur:t=>l("email",t.target.value),onKeyPress:t=>p("email",t)})}),e.jsx("th",{className:"px-3 py-3"}),e.jsx("th",{className:"px-3 py-3",children:e.jsxs(o,{className:"w-full text-sm font-medium",defaultValue:s.kind,onChange:t=>l("kind",t.target.value),children:[e.jsx("option",{value:"",children:"اختر نوع الحساب"}),e.jsx("option",{value:"admin",children:"مدير نظام"}),e.jsx("option",{value:"super_user",children:"حساب تاجر مميز"}),e.jsx("option",{value:"user",children:"مركز بيع عادي"})]})}),e.jsx("th",{className:"px-3 py-3",children:e.jsxs(o,{className:"w-full text-sm font-medium",defaultValue:s.status,onChange:t=>l("status",t.target.value),children:[e.jsx("option",{value:"",children:"اختر الحالة"}),e.jsx("option",{value:"active",children:"فعال"}),e.jsx("option",{value:"inactive",children:"غير فعال"})]})}),e.jsx("th",{className:"px-3 py-3",children:e.jsxs(o,{className:"w-full text-sm font-medium",defaultValue:s.created_by,onChange:t=>l("created_by",t.target.value),children:[e.jsx("option",{value:"",children:"اختر المسؤول"}),j.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id))]})}),e.jsx("th",{className:"px-3 py-3"}),e.jsx("th",{className:"px-3 py-3"})]})}),e.jsx("tbody",{className:"text-center",children:n.data.map(t=>e.jsxs("tr",{className:"bg-white border-b dark:bg-gray-800 dark:border-gray-700",children:[e.jsx("td",{className:"px-3 py-2 flex justify-center items-center",children:e.jsx("img",{src:t.image,className:"rounded-full w-[50px] h-[50px] ml-2 border-2 border-gray-300"})}),e.jsx("td",{className:"px-3 py-2 text-nowrap",children:t.name}),e.jsx("td",{className:"px-3 py-2",children:t.email}),e.jsx("td",{className:"px-3 py-2",children:t.center}),e.jsx("td",{className:"px-3 py-2 text-center",children:e.jsx("span",{className:" px-2 py-0 cursor-pointer rounded text-white text-nowrap "+b[t.kind],children:v[t.kind]})}),e.jsx("td",{className:"px-3 py-2 text-center",children:e.jsx("span",{className:"px-2 py-0 cursor-pointer rounded text-white text-nowrap "+w[t.status],children:y[t.status]})}),e.jsx("td",{className:"px-3 py-2 text-nowrap",children:t.createdBy}),e.jsx("td",{className:"px-3 py-2 text-nowrap",children:t.created_at}),e.jsx("td",{className:"px-3 py-2 text-nowrap",children:e.jsx(k,{onClick:d=>f(t),children:"تعديل"})})]},t.id))})]})}),e.jsx(N,{links:n.meta.links})]})})]})})]})}export{$ as default};
