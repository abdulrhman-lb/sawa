import{r,j as o,R as N}from"./app-4CarAZae.js";import{T as S}from"./TextInput-DyNG2S4m.js";function M({items:s=[],value:p,onChange:f,placeholder:i="اختر عنصرًا",labelKey:n="name",valueKey:a="id"}){const[w,d]=r.useState(!1),[m,l]=r.useState(""),[u,x]=r.useState({top:0,left:0,width:0}),[b,c]=r.useState(i),g=r.useRef(null);r.useEffect(()=>{if(Array.isArray(s)){const e=s.find(t=>t[a]===p);c(e?e[n]:i)}},[p,s,n,a,i]),r.useEffect(()=>{l("")},[s]),r.useEffect(()=>{const e=t=>{g.current&&!g.current.contains(t.target)&&d(!1)};return document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}},[]);const h=Array.isArray(s)?s.filter(e=>e[n].toLowerCase().includes(m.toLowerCase())):[],y=e=>{const t=e.currentTarget.getBoundingClientRect();x({top:t.bottom,left:t.left,width:t.width>200?t.width:200}),d(!w)},k=e=>{c(e[n]),f(e[a]),d(!1)},j=()=>{l(""),c("عرض الكل"),f(null),d(!1)},v=o.jsxs("div",{style:{top:u.top,left:u.left,width:u.width},className:"absolute bg-white dark:bg-gray-900 border border-gray-300 rounded mt-1 z-50",onMouseDown:e=>e.stopPropagation(),children:[o.jsx(S,{className:"w-full mb-2 p-2 border-b border-gray-300",placeholder:"ابحث...",value:m,onChange:e=>l(e.target.value),onMouseDown:e=>e.stopPropagation()}),o.jsxs("ul",{className:"max-h-60 overflow-y-auto text-gray-900 dark:text-white text-sm",children:[o.jsx("li",{className:"px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer",onMouseDown:e=>{e.stopPropagation(),j()},children:"عرض الكل"}),h.map(e=>o.jsx("li",{className:"px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer",onMouseDown:t=>{t.stopPropagation(),k(e)},children:e[n]},e[a])),h.length===0&&o.jsx("li",{className:"px-4 py-2 text-gray-500 dark:text-gray-400",children:"لا توجد نتائج"})]})]});return o.jsxs("div",{className:"relative w-full",ref:g,children:[o.jsxs("button",{type:"button",onClick:y,className:"w-full font-medium text-sm text-right p-2 flex border-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",children:[o.jsx("svg",{className:"w-4 h-4 ml-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:o.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 9l-7 7-7-7"})}),b]}),w&&N.createPortal(v,document.body)]})}export{M as S};
