import{W as f,r as N,j as e,Y as b,a as w}from"./app-4CarAZae.js";import{A as y,a as I,R as k}from"./AuthenticatedLayout-DlZAqirn.js";import{I as r}from"./InputError-BzZEBFuT.js";import{I as l}from"./InputLabel-D2XIgsB6.js";import{S as C}from"./ScrollBar-2ExapV3B.js";import{S as n}from"./SelectInput-CHXUtI-C.js";import{T as F}from"./TextAreaInput-D3aa6kLy.js";import{T as c}from"./TextInput-DyNG2S4m.js";import{T as S}from"./Title-Dy3FFUwd.js";import"./ApplicationLogo-Dv8uwSlW.js";import"./transition-B3zTIZ2S.js";import"./NavLink-Bq0O64v2.js";import"./DarkMode-Bf1Neqjf.js";import"./iconBase-TbwvlisU.js";import"./ResponsiveMenu-BnbI3YqC.js";import"./index-_Gq6pFcl.js";import"./Modal-DeS_P8Lr.js";function M({auth:d,categories:u,message:o}){const{data:i,setData:a,post:x,errors:t,reset:T}=f({image:"",name:"",status:"active",notes:"",phone:""}),p="/images/products/noimage.jpg",[h,j]=N.useState(null),g=s=>{const m=s.target.files[0];m&&j(URL.createObjectURL(m)),a("image",m)},v=s=>{s.preventDefault(),console.log(i),x(route("product.store"))};return e.jsxs(y,{user:d.user,message:o,header:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx(S,{children:"إنشاء منتج جديد"}),e.jsx(C,{message:o})]}),children:[e.jsx(b,{title:"المنتجات"}),e.jsx("div",{className:"py-2",children:e.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:e.jsx("div",{className:"bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg",children:e.jsx("form",{onSubmit:v,className:"px-4 sm:px-8 pt-4 bg-white dark:bg-gray-800 shadow sm:rounded-lg",children:e.jsxs("div",{className:"justify-center grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2",children:[e.jsxs("div",{className:"order-2 lg:order-1",children:[e.jsxs("div",{children:[e.jsx(l,{htmlFor:"category_id",value:"التصنيف"}),e.jsxs(n,{id:"category_id",name:"category_id",className:"mt-1 block w-full",onChange:s=>a("category_id",s.target.value),children:[e.jsx("option",{value:"",children:"اختر التصنيف"}),u.data.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]}),e.jsx(r,{message:t.project_id,className:"mt-2"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(l,{htmlFor:"name",value:"اسم المنتج"}),e.jsx(c,{id:"name",type:"text",name:"name",value:i.name,isFocused:!0,className:"mt-1 block w-full",onChange:s=>a("name",s.target.value)}),e.jsx(r,{message:t.name,className:"mt-2"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(l,{htmlFor:"phone",value:"رقم الهاتف"}),e.jsx(c,{id:"phone",type:"text",name:"phone",value:i.phone,className:"mt-1 block w-full",onChange:s=>a("phone",s.target.value)}),e.jsx(r,{message:t.phone,className:"mt-2"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(l,{htmlFor:"status",value:"الحالة"}),e.jsxs(n,{id:"status",name:"status",className:"mt-1 block w-full",onChange:s=>a("status",s.target.value),children:[e.jsx("option",{value:"active",children:"فعال"}),e.jsx("option",{value:"inactive",children:"غير فعال"})]}),e.jsx(r,{message:t.status,className:"mt-2"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(l,{htmlFor:"notes",value:"ملاحظات"}),e.jsx(F,{id:"notes",name:"notes",value:i.notes,className:"mt-1 block w-full",onChange:s=>a("notes",s.target.value)}),e.jsx(r,{message:t.notes,className:"mt-2"})]}),e.jsxs("div",{className:"text-center py-2",children:[e.jsx(I,{className:"w-28 justify-center",children:"موافق"}),e.jsx(w,{href:route("product.index"),children:e.jsx(k,{className:"w-28 justify-center",children:"إلغاء الأمر"})})]})]}),e.jsx("div",{className:"flex justify-center items-center order-1 py-2 lg:order-2",children:e.jsxs("div",{className:"relative inline-block items-center justify-end",children:[e.jsx("img",{src:h||p,alt:"Uploaded",className:"w-[200px] h-[200px] object-cover rounded-full border-2"}),e.jsx("label",{htmlFor:"image",className:"absolute bottom-2 right-5 bg-white p-1 rounded-full cursor-pointer shadow-md",children:e.jsx("img",{src:"https://img.icons8.com/material-rounded/24/000000/camera.png",alt:"camera icon"})}),e.jsx("input",{id:"image",type:"file",name:"image",className:"hidden",onChange:g,accept:"image/*"})]})})]})})})})})]})}export{M as default};