export default function Card() {
  return (
    <div className="flex justify-start flex-col p-14 m-2 shadow-lg rounded-lg w-[520px] h-[610px] bg-white text-black font-nazanin rtl">
      {/* header */}
      <div className="w-2/3 my-4">
        <h3 className="text-[40px] font-bold">درباره ی باشگاه مگا</h3>
      </div>
      {/* description */}
      <div className="w-full my-4">
        <p className="text-[20px] font-semibold">
          هدف ما در این باشگاه کمک به سلامتی و پرورش اندام شما ورزشکاران است
        </p>
      </div>
    </div>
  );
}
