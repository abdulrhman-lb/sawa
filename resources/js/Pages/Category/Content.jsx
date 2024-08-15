
import { Link } from "@inertiajs/react";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

const Content = ({ image, name, id }) => {
  return (
    <>
      <div className="text-white group">
        <Link 
        // href={route()}
        >
        <div className="overflow-hidden pt-2">
          <img src={image} alt=""
            className="mx-auto h-[240px] w-[240px] border-4 p-1 border-token1 dark:border-token2 rounded-2xl object-cover group-hover:scale-105 duration-300"
          />
          <div className="mx-auto w-[280px] space-y-4 p-4 mt-2 bg-token1 dark:bg-token2 -translate-y-14 rounded-lg group-hover:scale-90 duration-300">
            <h1 className="line-clamp-1 text-xl text-center">{name}</h1>
          </div>
        </div>
        </Link>
      </div>

    </>
  );
}

export default Content;
