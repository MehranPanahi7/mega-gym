"use client";
import { FaUser, FaLock } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { registerUser } from "@/store/slices/authSlices/registerSlice";

interface FormData {
  username: string;
  user_email: string;
  user_password: string;
}

export default function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { error, success, loading } = useSelector(
    (state: RootState) => state.register
  );
  const [formData, setFormData] = useState<FormData>({
    username: "",
    user_email: "",
    user_password: "",
  });
  const [passwordType, setPasswordType] = useState<string>("password");

  //مدیریت تغییرات ورودی ها
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // مدیریت ثبت فرم
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(registerUser(formData));
  };

  const changePasswordType = () =>
    passwordType === "password"
      ? setPasswordType("text")
      : setPasswordType("password");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      {/* لایه بکگراند */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat form-bg2 opacity-80 blur-[2px]"></div>
      {/* فرم ثبت نام  */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg z-10">
        <h2 className="font-nazanin text-3xl font-black my-4 text-center">
          فرم ثبت نام
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* فیلد نام کاربری */}
          <div className="flex items-center bg-gray-200 rounded-lg p-3">
            <FaUser size={24} className="text-gray-600" />
            <input
              className="bg-transparent flex-1 p-2 outline-none text-gray-800"
              type="text"
              placeholder="نام کاربری"
              name="username"
              onChange={handleChange}
              value={formData.username}
            />
          </div>

          {/* فیلد ایمیل */}
          <div className="flex items-center bg-gray-200 rounded-lg p-3">
            <label className="flex justify-start items-center">
              <MdOutlineAlternateEmail size={24} className="text-gray-600" />
            </label>
            <input
              className="bg-transparent flex-1 p-2 outline-none text-gray-800"
              type="email"
              placeholder="ایمیل"
              name="user_email"
              onChange={handleChange}
              value={formData.user_email}
            />
          </div>

          {/* فیلد رمز عبور */}
          <div className="flex items-center bg-gray-200 rounded-xl p-3">
            <FaLock size={24} className="text-gray-600" />
            <input
              className="bg-transparent flex-1 p-2 outline-none text-gray-800"
              type={passwordType}
              placeholder="رمز عبور"
              name="user_password"
              onChange={handleChange}
              value={formData.user_password}
            />
            <button type="button" onClick={changePasswordType}>
              {passwordType === "password" ? (
                <IoMdEye size={30} className="text-gray-600" />
              ) : (
                <IoMdEyeOff size={30} className="text-gray-600" />
              )}
            </button>
          </div>

          {/* دکمه ثبت نام */}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg text-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "درحال ثبت نام" : "ثبت نام"}
          </button>

          {/* لینک ورود به صفحه لاگین */}
          <Link
            href="/pages/signin"
            className="text-right my-5 text-blue-400 font-nazanin text-sm"
          >
            حساب کاربری دارید؟ / وارد شوید
          </Link>
          {/* بخش مدیریت خطا */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center rtl font-nazanin">
              {error}
            </div>
          )}
          {/* بخش مدیریت پیغام ثبت نام موفق */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center rtl font-nazanin">
              ثبت نام با موفقیت انجام شد.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
