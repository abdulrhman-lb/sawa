import { useState, useEffect } from 'react';
import { BiSolidSun, BiSolidMoon } from "react-icons/bi"

const DarkMode = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  const element = document.documentElement;

  useEffect(() => {
    localStorage.setItem("theme", theme)
    if (theme === "dark") {
      element.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      element.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  })

  return (
    <>
      {
        theme === "dark" ? (
          <BiSolidSun onClick={() => setTheme("light")}
            className="text-2xl cursor-pointer
                        hover:text-token1  
                        hover:border-token1
                        dark:hover:text-token2
                        dark:hover:border-token2" />
        ) : (
          <BiSolidMoon
            onClick={() => setTheme("dark")}
            className="text-2xl cursor-pointer
                        hover:text-token1  
                        hover:border-token1
                        dark:hover:text-token2
                        dark:hover:border-token2" />
        )
      }
    </>
  );
}

export default DarkMode;
