import{r,j as e,a as p}from"./app-4CarAZae.js";import{q as x}from"./transition-B3zTIZ2S.js";const c=r.createContext(),i=({children:t})=>{const[o,n]=r.useState(!1),s=()=>{n(a=>!a)};return e.jsx(c.Provider,{value:{open:o,setOpen:n,toggleOpen:s},children:e.jsx("div",{className:"relative",children:t})})},m=({children:t})=>{const{open:o,setOpen:n,toggleOpen:s}=r.useContext(c);return e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:s,children:t}),o&&e.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>n(!1)})]})},u=({align:t="right",width:o="60",contentClasses:n="py-1 bg-white dark:bg-gray-900",children:s})=>{const{open:a,setOpen:d}=r.useContext(c);let l="origin-top";t==="left"?l="ltr:origin-top-left rtl:origin-top-right start-0":t==="right"&&(l="ltr:origin-top-right rtl:origin-top-left end-0");let g="";return o==="60"&&(g="w-60"),e.jsx(e.Fragment,{children:e.jsx(x,{as:r.Fragment,show:a,enter:"transition ease-out duration-200",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:e.jsx("div",{className:`absolute z-50 mt-2 rounded-md shadow-lg ${l} ${g}`,onClick:()=>d(!1),children:e.jsx("div",{className:"rounded-md ring-1 ring-black ring-opacity-5 "+n,children:s})})})})},h=({className:t="",isActive:o=!1,children:n,...s})=>e.jsx(p,{...s,className:"block my-1 mx-1 px-4 py-2 text-start lg:text-base rounded-md leading-5 transition duration-150 ease-in-out "+(o?"bg-red-600 text-white":"bg-blue-700 text-white hover:bg-blue-800")+t,children:n});i.Trigger=m;i.Content=u;i.Link=h;const v=i;function b(t){return JSON.stringify(t.message)}export{b as A,v as D};
