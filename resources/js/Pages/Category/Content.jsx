
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

const Content = ({ image, name, id }) => {
  return (
    <>
      <div data-aos="fade-up" data-aos-delay={300} className="text-white group" >
        <Link
          key={id}
          href={route("product.home", { id })}
        >
          <div className="overflow-hidden pt-2">
            <img src={image} alt=""
              className="mx-auto h-[300px] w-[300px] border-4 p-1 border-token1 dark:border-token2 rounded-full object-cover group-hover:scale-105 duration-300"
            />
            <div className="mx-auto w-[280px] space-y-4 p-4 mt-20 bg-token1 dark:bg-token2 -translate-y-14 rounded-lg group-hover:scale-90 duration-300">
              <h1 className="line-clamp-1 text-xl text-center">{name}</h1>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default Content;
