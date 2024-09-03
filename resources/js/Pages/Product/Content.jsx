
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

const Content = ({ image, name, id, phone }) => {
  
  return (
    <>
      <div data-aos="fade-up" data-aos-delay={50} className="text-white group">
      <Link
          key={id}
          href={route("service.home", { id })}
        >
        <div className="overflow-hidden pt-2">
          <img src={image} alt=""
            className="mx-auto h-[100px] w-[100px] border-4 p-1 border-token1 dark:border-token2 rounded-full object-cover group-hover:scale-105 duration-300"
          />
          <div className="mx-auto w-[150px] space-y-4 p-1 mt-16 bg-token1 dark:bg-token2 -translate-y-14 rounded-lg group-hover:scale-90 duration-300">
            <h1 className="line-clamp-1 text-me text-center">{name} - {phone}</h1>
          </div>
        </div>
        </Link>
      </div>

    </>
  );
}

export default Content;
