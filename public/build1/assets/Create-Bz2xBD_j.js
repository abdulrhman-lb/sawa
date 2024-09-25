import{W as j,j as e,Y as p,a as h}from"./app-4CarAZae.js";import{A as v,a as _,R as g}from"./AuthenticatedLayout-DlZAqirn.js";import{I as i}from"./InputError-BzZEBFuT.js";import{I as l}from"./InputLabel-D2XIgsB6.js";import{S as f}from"./ScrollBar-2ExapV3B.js";import{S as r}from"./SelectInput-CHXUtI-C.js";import{T as N}from"./TextAreaInput-D3aa6kLy.js";import{T as w}from"./TextInput-DyNG2S4m.js";import{T as b}from"./Title-Dy3FFUwd.js";import"./ApplicationLogo-Dv8uwSlW.js";import"./transition-B3zTIZ2S.js";import"./NavLink-Bq0O64v2.js";import"./DarkMode-Bf1Neqjf.js";import"./iconBase-TbwvlisU.js";import"./ResponsiveMenu-BnbI3YqC.js";import"./index-_Gq6pFcl.js";import"./Modal-DeS_P8Lr.js";function H({auth:o,products:c,data_kinds:d,message:n}){const{data:m,setData:a,post:u,errors:t,reset:k}=j({name:"",status:"active",notes:""}),x=s=>{s.preventDefault(),u(route("service.store"))};return e.jsxs(v,{user:o.user,message:n,header:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx(b,{children:"إنشاء خدمة جديدة"}),e.jsx(f,{message:n})]}),children:[e.jsx(p,{title:"الخدمات"}),e.jsx("div",{className:"py-2",children:e.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:e.jsx("div",{className:"bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg",children:e.jsxs("form",{onSubmit:x,className:"px-4 sm:px-8 pt-4 bg-white dark:bg-gray-800 shadow sm:rounded-lg",children:[e.jsxs("div",{className:"grid lg:grid-cols-3 sm:grid-cols-1 gap-4",children:[e.jsxs("div",{children:[e.jsx(l,{htmlFor:"name",value:"اسم الخدمة"}),e.jsx(w,{id:"name",type:"text",name:"name",value:m.name,isFocused:!0,className:"mt-1 block w-full",onChange:s=>a("name",s.target.value)}),e.jsx(i,{message:t.name,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(l,{htmlFor:"product_id",value:"المنتج"}),e.jsxs(r,{id:"product_id",name:"product_id",className:"mt-1 block w-full",onChange:s=>a("product_id",s.target.value),children:[e.jsx("option",{value:"0",children:"اختر المنتج"}),c.data.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]}),e.jsx(i,{message:t.product_id,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(l,{htmlFor:"status",value:"الحالة"}),e.jsxs(r,{id:"status",name:"status",className:"mt-1 block w-full",onChange:s=>a("status",s.target.value),children:[e.jsx("option",{value:"active",children:"فعال"}),e.jsx("option",{value:"inactive",children:"غير فعال"})]}),e.jsx(i,{message:t.status,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(l,{htmlFor:"data_kind_id_1",value:"نوع البيانات الأول"}),e.jsxs(r,{id:"data_kind_id_1",name:"data_kind_id_1",className:"mt-1 block w-full",onChange:s=>a("data_kind_id_1",s.target.value),children:[e.jsx("option",{value:"",children:"اختر نوع البيانات الأول"}),d.data.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]}),e.jsx(i,{message:t.data_kind_id_1,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(l,{htmlFor:"data_kind_id_2",value:"نوع البيانات الثاني"}),e.jsxs(r,{id:"data_kind_id_2",name:"data_kind_id_2",className:"mt-1 block w-full",onChange:s=>a("data_kind_id_2",s.target.value),children:[e.jsx("option",{value:"",children:"اختر نوع البيانات الثاني"}),d.data.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]}),e.jsx(i,{message:t.data_kind_id_2,className:"mt-2"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(l,{htmlFor:"notes",value:"ملاحظات"}),e.jsx(N,{id:"notes",name:"notes",value:m.notes,className:"mt-1 block w-full",onChange:s=>a("notes",s.target.value)}),e.jsx(i,{message:t.notes,className:"mt-2"})]}),e.jsxs("div",{className:"text-center py-4",children:[e.jsx(_,{className:"w-28 justify-center",children:"موافق"}),e.jsx(h,{href:route("service.index"),children:e.jsx(g,{className:"w-28 justify-center",children:"إلغاء الأمر"})})]})]})})})})]})}export{H as default};