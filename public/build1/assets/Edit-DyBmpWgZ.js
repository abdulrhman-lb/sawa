import{W as j,j as a,Y as _,a as h}from"./app-4CarAZae.js";import{A as v,a as g,R as f}from"./AuthenticatedLayout-DlZAqirn.js";import{I as l}from"./InputError-BzZEBFuT.js";import{I as n}from"./InputLabel-D2XIgsB6.js";import{S as N}from"./ScrollBar-2ExapV3B.js";import{S as m}from"./SelectInput-CHXUtI-C.js";import{T as k}from"./TextAreaInput-D3aa6kLy.js";import{T as w}from"./TextInput-DyNG2S4m.js";import{T as b}from"./Title-Dy3FFUwd.js";import"./ApplicationLogo-Dv8uwSlW.js";import"./transition-B3zTIZ2S.js";import"./NavLink-Bq0O64v2.js";import"./DarkMode-Bf1Neqjf.js";import"./iconBase-TbwvlisU.js";import"./ResponsiveMenu-BnbI3YqC.js";import"./index-_Gq6pFcl.js";import"./Modal-DeS_P8Lr.js";function G({auth:c,service:s,products:u,data_kinds:r,message:o}){const{data:t,setData:d,post:x,errors:i,reset:y}=j({image:"",name:s.name||"",status:s.status||"",notes:s.notes||"",product_id:s.product_id||"",data_kind_id_1:s.data_kind_id_1||"",data_kind_id_2:s.data_kind_id_2||"",_method:"PUT"}),p=e=>{e.preventDefault(),x(route("service.update",s.id))};return a.jsxs(v,{user:c.user,message:o,header:a.jsxs("div",{className:"flex justify-between items-center",children:[a.jsxs(b,{children:['تعديل المنتج "',s.name,'"']}),a.jsx(N,{message:o})]}),children:[a.jsx(_,{title:"المنتجات"}),a.jsx("div",{className:"py-2",children:a.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:a.jsx("div",{className:"bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg",children:a.jsxs("form",{onSubmit:p,className:"px-4 sm:px-8 pt-4 bg-white dark:bg-gray-800 shadow sm:rounded-lg",children:[a.jsxs("div",{className:"grid lg:grid-cols-3 sm:grid-cols-1 gap-4",children:[a.jsxs("div",{children:[a.jsx(n,{htmlFor:"name",value:"اسم الخدمة"}),a.jsx(w,{id:"name",type:"text",name:"name",value:t.name,isFocused:!0,className:"mt-1 block w-full",onChange:e=>d("name",e.target.value)}),a.jsx(l,{message:i.name,className:"mt-2"})]}),a.jsxs("div",{children:[a.jsx(n,{htmlFor:"product_id",value:"المنتج"}),a.jsxs(m,{id:"product_id",name:"product_id",className:"mt-1 block w-full",onChange:e=>d("product_id",e.target.value),value:t.product_id,children:[a.jsx("option",{value:"0",children:"اختر المنتج"}),u.data.map(e=>a.jsx("option",{value:e.id,children:e.name},e.id))]}),a.jsx(l,{message:i.product_id,className:"mt-2"})]}),a.jsxs("div",{children:[a.jsx(n,{htmlFor:"status",value:"الحالة"}),a.jsxs(m,{id:"status",name:"status",className:"mt-1 block w-full",onChange:e=>d("status",e.target.value),value:t.status,children:[a.jsx("option",{value:"active",children:"فعال"}),a.jsx("option",{value:"inactive",children:"غير فعال"})]}),a.jsx(l,{message:i.status,className:"mt-2"})]}),a.jsxs("div",{children:[a.jsx(n,{htmlFor:"data_kind_id_1",value:"نوع البيانات الأول"}),a.jsxs(m,{id:"data_kind_id_1",name:"data_kind_id_1",className:"mt-1 block w-full",onChange:e=>d("data_kind_id_1",e.target.value),value:t.data_kind_id_1,children:[a.jsx("option",{value:"",children:"اختر نوع البيانات الأول"}),r.data.map(e=>a.jsx("option",{value:e.id,children:e.name},e.id))]}),a.jsx(l,{message:i.data_kind_id_1,className:"mt-2"})]}),a.jsxs("div",{children:[a.jsx(n,{htmlFor:"data_kind_id_2",value:"نوع البيانات الثاني"}),a.jsxs(m,{id:"data_kind_id_2",name:"data_kind_id_2",className:"mt-1 block w-full",onChange:e=>d("data_kind_id_2",e.target.value),value:t.data_kind_id_2,children:[a.jsx("option",{value:"",children:"اختر نوع البيانات الثاني"}),r.data.map(e=>a.jsx("option",{value:e.id,children:e.name},e.id))]}),a.jsx(l,{message:i.data_kind_id_2,className:"mt-2"})]})]}),a.jsxs("div",{className:"mt-4",children:[a.jsx(n,{htmlFor:"notes",value:"ملاحظات"}),a.jsx(k,{id:"notes",name:"notes",value:t.notes,className:"mt-1 block w-full",onChange:e=>d("notes",e.target.value)}),a.jsx(l,{message:i.notes,className:"mt-2"})]}),a.jsxs("div",{className:"text-center py-4",children:[a.jsx(g,{className:"w-28 justify-center",children:"موافق"}),a.jsx(h,{href:route("service.index"),children:a.jsx(f,{className:"w-28 justify-center",children:"إلغاء الأمر"})})]})]})})})})]})}export{G as default};
