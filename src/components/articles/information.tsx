import Image from "next/image";

export default function Information() {
  return (
    <div className="information w-full h-[550px]">
      <div className="flex justify-center items-center p-4 m-16">
        <h4 className="font-bold text-white text-3xl border-b-2 border-white pb-5 font-nazanin text-[30px]">
          خدمات
        </h4>
      </div>
      <div className="flex justify-center items-start p-4 m-3">
        <ul className="flex justify-center items-start">
          <li className="mx-7 transition-all delay-150 hover:scale-125">
            <div className="flex justify-center items-center flex-col p-2">
              <Image
                src="/assets/body1.png"
                width={100}
                height={100}
                alt="fitness"
                className="bg-white rounded-full p-4"
              />
              <p className="text-white font-nazanin my-4">برنامه لاغری</p>
            </div>
          </li>
          <li className="mx-7 transition-all delay-150 hover:scale-125">
            <div className="flex justify-center items-center flex-col p-2">
              <Image
                src="/assets/dummble1.png"
                width={100}
                height={100}
                alt="fitness"
                className="bg-white rounded-full p-4"
              />
              <p className="text-white font-nazanin my-4">بدنسازی</p>
            </div>
          </li>
          <li className="mx-7 transition-all delay-150 hover:scale-125">
            <div className="flex justify-center items-center flex-col p-2">
              <Image
                src="/assets/plan1.png"
                width={100}
                height={100}
                alt="fitness"
                className="bg-white rounded-full p-4"
              />
              <p className="text-white font-nazanin my-4">برنامه تمرینی</p>
            </div>
          </li>
          <li className="mx-7 transition-all delay-150 hover:scale-125">
            <div className="flex justify-center items-center flex-col p-2">
              <Image
                src="/assets/trademil1.png"
                width={100}
                height={100}
                alt="fitness"
                className="bg-white rounded-full p-4"
              />
              <p className="text-white font-nazanin my-4">هوازی</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
