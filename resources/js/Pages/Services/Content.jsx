import { Link } from "@inertiajs/react";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

const Content = ({ name, id, onClick }) => {
  return (
    <>
      <div data-aos="fade-up" data-aos-delay={(id) * 50} className="text-white group cursor-pointer" onClick={onClick}>
        {/* <Link
          key={id}
          href={route("service.home", { id })}
        > */}
          <div className="overflow-hidden h-[100px] ">
            <div className="mx-auto h-[60px] pt-3 w-[250px] space-y-2 mt-16 bg-token1 dark:bg-token2 -translate-y-14 rounded-lg group-hover:scale-90 duration-300">
              <h1 className="line-clamp-1 text-xl text-center mt-1">{name}</h1>
            </div>
          </div>
        {/* </Link> */}
      </div>
    </>
  );
}

export default Content;
