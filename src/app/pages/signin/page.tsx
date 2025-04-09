"use client";
import Link from "next/link";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { loginUser } from "@/store/slices/authSlices/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";

interface FormData {
  identifier: string;
  password: string;
}

export default function SigninPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, lastAction } = useSelector((state: RootState) => state.login);

  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
  });
  const [passwordType, setPasswordType] = useState<string>("password");
  const router = useRouter();

  // مدیریت تغییرات ورودی
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //مدیریت دکمه ثبت و فراخوانی Redux
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // بررسی مقدار FormData
    if (!formData.identifier || !formData.password)
      return alert("لطفا تمام فیلدهارا پر کنید.");

    const resultAction = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(resultAction)) router.push("/");
  };

  const changePasswordType = () =>
    passwordType === "password"
      ? setPasswordType("text")
      : setPasswordType("password");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      {/* لایه بکگراند */}
      <div className="absolute inset-0 bg-cover bg-no-repeat bg-center form-bg1 opacity-80 blur-[2px]"></div>
      {/* فرم ثبت نام */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg z-10">
        <h2 className="font-nazanin text-3xl font-black my-4 text-center">
          فرم ورود
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* فیلد نام کاربری یا ایمیل */}
          <div className="flex items-center bg-gray-200 rounded-lg p-3">
            <FaUser size={24} className="text-gray-600" />
            <input
              className="bg-transparent flex-1 p-2 outline-none text-gray-800"
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="نام کاربری یا ایمیل"
            />
          </div>

          {/* فیلد رمزعبور */}
          <div className="flex items-center bg-gray-200 rounded-lg p-3">
            <FaLock size={24} className="text-gray-600" />
            <input
              className="bg-transparent flex-1 p-2 outline-none text-gray-800"
              type={passwordType}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="رمز عبور"
            />
            <button type="button" onClick={changePasswordType}>
              {passwordType === "password" ? (
                <IoMdEye size={30} className="text-gray-600" />
              ) : (
                <IoMdEyeOff size={30} className="text-gray-600" />
              )}
            </button>
          </div>

          {/* دکمه ی ورود */}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg text-lg"
            disabled={loading}
            type="submit"
          >
            {loading ? "در حال وارد شدن" : "ورود"}
          </button>

          {/* لینک ورود به صفحه ثبت نام */}
          <Link
            href="/pages/signup"
            className="text-right my-5 text-blue-400 font-nazanin text-sm"
          >
            حساب کاربری ندارید؟ / ثبت نام کنید
          </Link>
          {/* بخش مدیریت خطا */}
          {error && lastAction === "loginUser" && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center rtl font-nazanin">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
