
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

const Content = ({ name, id }) => {
  
  return (
    <>
      <div data-aos="fade-up" data-aos-delay={(id)*50} className="text-white group">
      <Link
          key={id}
          href={route("service.home", { id })}
        >
        <div className="overflow-hidden pt-2">
          <div className="mx-auto h-[50px] pt-3 w-[250px] space-y-4 p-1 mt-16 bg-token1 dark:bg-token2 -translate-y-14 rounded-lg group-hover:scale-90 duration-300">
            <h1 className="line-clamp-1 text-me text-center">{name}</h1>
          </div>
        </div>
        </Link>
      </div>

    </>
  );
}

export default Content;
