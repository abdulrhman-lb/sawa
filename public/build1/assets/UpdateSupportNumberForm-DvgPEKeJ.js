import{W as u,j as e}from"./app-4CarAZae.js";import{P as l}from"./PrimaryButton-D4siN8KF.js";import{T as c}from"./TextInput-DyNG2S4m.js";import"./SelectInput-CHXUtI-C.js";import{q as d}from"./transition-B3zTIZ2S.js";import"./index-_Gq6pFcl.js";import"./iconBase-TbwvlisU.js";function N({className:s="",message:r}){const{data:a,setData:o,put:n,errors:x,processing:i,recentlySuccessful:m}=u({support_number:r.support_number,_method:"PUT"}),p=t=>{t.preventDefault(),n(route("settings.update.support",r.id))};return e.jsxs("section",{className:s,children:[e.jsx("header",{children:e.jsx("h2",{className:"text-lg font-medium text-gray-900 dark:text-gray-100 mb-4",children:"رقم الدعم الفني"})}),e.jsxs("form",{onSubmit:p,className:"space-y-6",children:[e.jsx("div",{className:"mt-4",children:e.jsx(c,{id:"name",className:"mt-1 block w-full",value:a.support_number,onChange:t=>o("support_number",t.target.value),autoComplete:"name"})}),e.jsxs("div",{className:"flex items-center gap-4 justify-center",children:[e.jsx(l,{disabled:i,children:"حفظ"}),e.jsx(d,{show:m,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:e.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"حفظ."})})]})]})]})}export{N as default};
