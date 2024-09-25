import{r as a,j as t}from"./app-4CarAZae.js";import{G as n}from"./iconBase-TbwvlisU.js";function s(e){return n({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142 3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z"},child:[]}]})(e)}function l(e){return n({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M6.995 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007-2.246-5.007-5.007-5.007S6.995 9.239 6.995 12zM11 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2H2zm17 0h3v2h-3zM5.637 19.778l-1.414-1.414 2.121-2.121 1.414 1.414zM16.242 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.344 7.759 4.223 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z"},child:[]}]})(e)}const h=()=>{const[e,r]=a.useState(localStorage.getItem("theme")?localStorage.getItem("theme"):"light"),o=document.documentElement;return a.useEffect(()=>{localStorage.setItem("theme",e),e==="dark"?(o.classList.add("dark"),localStorage.setItem("theme","dark")):(o.classList.remove("dark"),localStorage.setItem("theme","light"))}),t.jsx(t.Fragment,{children:e==="dark"?t.jsx(l,{onClick:()=>r("light"),className:`text-2xl cursor-pointer\r
                        hover:text-token1  \r
                        hover:border-token1\r
                        dark:hover:text-token2\r
                        dark:hover:border-token2`}):t.jsx(s,{onClick:()=>r("dark"),className:`text-2xl cursor-pointer\r
                        hover:text-token1  \r
                        hover:border-token1\r
                        dark:hover:text-token2\r
                        dark:hover:border-token2`})})},m=h;export{m as default};
