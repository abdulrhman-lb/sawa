import{r,j as e,Y as f,y as i}from"./app-4CarAZae.js";import{P as b}from"./Pagination-CSCna3ch.js";import"./TextInput-DyNG2S4m.js";import{A as N}from"./AuthenticatedLayout-DlZAqirn.js";import{T as a}from"./TableHeading-2ju96-yK.js";import{S as y}from"./SearchableDropdown-BIbm-UtK.js";import{S as u}from"./ScrollBar-2ExapV3B.js";import{S as w}from"./SuccessMessage-CL-2JUjC.js";import{D as k}from"./DeleteButton-CfGaPNIM.js";import{A as S}from"./AddButton-Cj9YlLQU.js";import{T as _}from"./Title-Dy3FFUwd.js";import"./ApplicationLogo-Dv8uwSlW.js";import"./transition-B3zTIZ2S.js";import"./NavLink-Bq0O64v2.js";import"./DarkMode-Bf1Neqjf.js";import"./iconBase-TbwvlisU.js";import"./ResponsiveMenu-BnbI3YqC.js";import"./index-_Gq6pFcl.js";import"./Modal-DeS_P8Lr.js";import"./InputError-BzZEBFuT.js";function Q({auth:x,users:o,message:l,category_permissions:c,queryParams:t=null,success:n}){r.useState(!1),r.useState(!1),r.useState(null),r.useState(""),r.useState(""),t=t||{};const p=s=>{m("user_id",s.id)},m=(s,d)=>{d?t[s]=d:delete t[s],t.page=1,i.get(route("category-permission.index"),t)},h=s=>{s===t.sort_field?t.sort_direction==="asc"?t.sort_direction="desc":t.sort_direction="asc":(t.sort_field=s,t.sort_direction="asc"),t.page=1,i.get(route("category-permission.index"),t)},g=s=>{window.confirm("هل تريد بالتأكيد حذف هذا صلاحية التصنيف لهذا المركز ؟")&&i.delete(route("category-permission.destroy",s.id))},j=()=>{i.get(route("category-permission.create"))};return e.jsxs(N,{user:x.user,message:l,header:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx(_,{children:"صلاحيات التصنيفات"}),e.jsx(u,{message:l}),e.jsx(S,{onClick:s=>j(),children:"إضافة"})]}),children:[e.jsx(f,{title:"الطلبات قيد المعالجة"}),e.jsx("div",{className:"py-2",children:e.jsxs("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:[n&&e.jsx(w,{message:n}),e.jsx("div",{className:"bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg",children:e.jsxs("div",{className:"p-2 text-gray-900 dark:text-gray-100",children:[e.jsx("div",{className:"overflow-auto",children:e.jsxs("table",{className:"w-full text-md font-semibold rtl:text-right text-gray-800 dark:text-gray-200",children:[e.jsx("thead",{className:"text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500",children:e.jsxs("tr",{className:"text-nowrap",children:[e.jsx(a,{name:"user_id",sort_field:t.sort_field,sort_direction:t.sort_direction,sortChanged:h,children:"المركز"}),e.jsx(a,{sortable:!1,children:"التصنيف"}),e.jsx(a,{sortable:!1,children:"التحكم"})]})}),e.jsx("thead",{className:"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500",children:e.jsxs("tr",{className:"text-nowrap",children:[e.jsx("th",{className:"px-3 py-3 relative",children:e.jsx(y,{items:o.data,name:"user_id",selectedItem:o.data.find(s=>s.id===t.user_id),onSelectItem:p,placeholder:"اختر المركز",queryParams:t})}),e.jsx("th",{className:"px-3 py-3"}),e.jsx("th",{className:"px-3 py-3"})]})}),e.jsx("tbody",{className:"text-center",children:c.data.map(s=>e.jsxs("tr",{className:"bg-white border-b dark:bg-gray-800 dark:border-gray-700",children:[e.jsx("td",{className:"px-3 py-2",children:s.user.name}),e.jsx("td",{className:"px-3 py-2",children:s.category.name}),e.jsx("td",{className:"px-3 py-2 text-nowrap",children:e.jsx(k,{onClick:d=>g(s),children:"حذف"})})]},s.id))})]})}),e.jsx(b,{links:c.meta.links,queryParams:t})]})})]})})]})}export{Q as default};
