
const Content = ({ name, id, onClick }) => {
  return (
    <>
      <div data-aos="fade-up" data-aos-delay={(id) * 50} className="text-white group cursor-pointer" onClick={onClick}>
        <div className="overflow-hidden h-[100px] ">
          <div className="mx-auto items-center text-center space-y-1 mt-16 -translate-y-14 rounded-lg group-hover:scale-90 duration-300">
            <button
              // onClick={e => editUser(user)}
              type="button"
              className="inline-flex w-[250px] items-center justify-center h-[60px] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-5 py-2 text-center me-2 mb-2">
              {name} 
            </button>
            {/* <h1 className="line-clamp-1 text-xl text-center mt-1"></h1> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Content;
