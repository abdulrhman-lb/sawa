export default function ApplicationLogo(props) {
  return (
    JSON.stringify(props.message)
    // <div className="text-center mx-4 block fill-current">
    //   <img src={`/storage/${message.image}`} className='rounded-full mx-auto w-[90px] h-[90px] lg:w-[80px] lg:h-[80px]' alt="" />
    // </div>
  );
}
