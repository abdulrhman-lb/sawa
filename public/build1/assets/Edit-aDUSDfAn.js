import{W as j,r as f,j as e,Y as v,a as N}from"./app-4CarAZae.js";import{A as b,a as w,R as y}from"./AuthenticatedLayout-DlZAqirn.js";import{I as i}from"./InputError-BzZEBFuT.js";import{I as l}from"./InputLabel-D2XIgsB6.js";import{S as I}from"./ScrollBar-2ExapV3B.js";import{S}from"./SelectInput-CHXUtI-C.js";import{T}from"./TextAreaInput-D3aa6kLy.js";import{T as _}from"./TextInput-DyNG2S4m.js";import{T as k}from"./Title-Dy3FFUwd.js";import"./ApplicationLogo-Dv8uwSlW.js";import"./transition-B3zTIZ2S.js";import"./NavLink-Bq0O64v2.js";import"./DarkMode-Bf1Neqjf.js";import"./iconBase-TbwvlisU.js";import"./ResponsiveMenu-BnbI3YqC.js";import"./index-_Gq6pFcl.js";import"./Modal-DeS_P8Lr.js";function K({auth:c,category:a,message:o}){const{data:n,setData:t,post:d,errors:r,reset:C}=j({image:"",name:a.name||"",status:a.status||"",notes:a.notes||"",_method:"PUT"}),u=a.image!=null&&a.image!=""?a.image:"/images/categories/noimage.jpg",[x,g]=f.useState(null),p=s=>{const m=s.target.files[0];m&&g(URL.createObjectURL(m)),t("image",m)},h=s=>{s.preventDefault(),d(route("category.update",a.id))};return e.jsxs(b,{user:c.user,message:o,header:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs(k,{children:['تعديل التصنيف  "',a.name,'"']}),e.jsx(I,{message:o})]}),children:[e.jsx(v,{title:"تصنيفات المنتجات"}),e.jsx("div",{className:"py-2",children:e.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:e.jsx("div",{className:"bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg",children:e.jsx("form",{onSubmit:h,className:"px-4 sm:px-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg",children:e.jsxs("div",{className:"justify-center grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2",children:[e.jsxs("div",{className:"order-2 lg:order-1",children:[e.jsxs("div",{className:"mt-4",children:[e.jsx(l,{htmlFor:"category_name",value:"اسم التصنيف"}),e.jsx(_,{id:"category_name",type:"text",name:"name",value:n.name,isFocused:!0,className:"mt-1 block w-full",onChange:s=>t("name",s.target.value)}),e.jsx(i,{message:r.name,className:"mt-2"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(l,{htmlFor:"category_status",value:"حالة التصنيف"}),e.jsxs(S,{id:"category_status",name:"status",className:"mt-1 block w-full",onChange:s=>t("status",s.target.value),children:[e.jsx("option",{value:"active",children:"فعال"}),e.jsx("option",{value:"inactive",children:"غير فعال"})]}),e.jsx(i,{message:r.status,className:"mt-2"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(l,{htmlFor:"category_notes",value:"ملاحظات"}),e.jsx(T,{id:"category_notes",name:"notes",value:n.notes,className:"mt-1 block w-full",onChange:s=>t("notes",s.target.value)}),e.jsx(i,{message:r.notes,className:"mt-2"})]}),e.jsxs("div",{className:"text-center py-4",children:[e.jsx(w,{className:"w-28 justify-center",children:"موافق"}),e.jsx(N,{href:route("category.index"),children:e.jsx(y,{className:"w-28 justify-center",children:"إلغاء الأمر"})})]})]}),e.jsx("div",{className:"flex justify-center items-center order-1 py-2 lg:order-2",children:e.jsxs("div",{className:"relative inline-block items-center justify-end",children:[e.jsx("img",{src:x||u,alt:"Uploaded",className:"w-[200px] h-[200px] object-cover rounded-full border-2"}),e.jsx("label",{htmlFor:"image",className:"absolute bottom-2 right-5 bg-white p-1 rounded-full cursor-pointer shadow-md",children:e.jsx("img",{src:"https://img.icons8.com/material-rounded/24/000000/camera.png",alt:"camera icon"})}),e.jsx("input",{id:"image",type:"file",name:"image",className:"hidden",onChange:p,accept:"image/*"})]})})]})})})})})]})}export{K as default};
