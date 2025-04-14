import Link from "next/link";

export default function Article() {
  return (
    <div className="flex flex-col md:flex-row justify-around items-center p-8 md:p-16 w-full h-fit m-2 bg-white text-black font-nazanin gap-6">
      {/* بخش اول */}
      <div className="flex flex-col justify-start items-center text-center md:text-right ">
        <h2 className="my-4 font-bold text-2xl md:text-4xl mb-4 md:mb-9 md:text-right">
          صفحات مربوطه
        </h2>
        <ul className="font-extralight gap-6 rtl border-b-2 md:border-b-0 md:border-r-2 border-gray-600 py-6 md:px-9">
          <li className="my-4">
            <Link
              href="/"
              className="text-lg md:text-[20px] font-semibold text-blue-500 hover:text-black"
            >
              خانه
            </Link>
          </li>
          <li className="my-4">
            <Link
              href="/pages/signup"
              className="text-lg md:text-[23px] font-semibold text-blue-500 hover:text-black"
            >
              ثبت نام / ورود به برنامه
            </Link>
          </li>
        </ul>
      </div>

      {/* بخش دوم */}
      <div className="flex flex-col justify-center items-center text-center rtl">
        <h2 className="my-4 font-semibold text-2xl md:text-4xl mb-4 md:mb-9 md:text-right">
          شهریه
        </h2>
        <ul className="text-[25px] font-semibold gap-6 rtl border-b-2 md:border-b-0 md:border-r-2 border-gray-600 py-6 md:px-9">
          <li className="my-4">روزانه : 1/500/000 تومان</li>
          <li className="my-4">روز در میان : 1/000/000 تومان</li>
        </ul>
      </div>

      {/* بخش سوم */}
      <div className="flex flex-col justify-end items-center text-center rtl gap-4">
        <h2 className="my-4 font-semibold text-2xl md:text-4xl">برنامه کاری</h2>
        <ul className="text-[25px] font-semibold gap-6">
          <li className="my-4">هر روز به غیر از ایام تعطیل:</li>
          <li className="my-4">ساعت 8 صبح الی 13 شیفت بانوان</li>
          <li className="my-4">ساعت 13:30 الی 23 شیفت آقایان</li>
        </ul>
      </div>
    </div>
  );
}
