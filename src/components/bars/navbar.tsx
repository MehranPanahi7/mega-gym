"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAuthStatus,
  fetchLogout,
} from "@/store/slices/authSlices/loginSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated
  );

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(fetchLogout());
  };

  return (
    <div className="w-screen md:w-screen bg-white p-4 flex justify-between items-center shadow-2x">
      {/* left side */}
      <div className="flex justify-start items-center p-3 w-1/3 font-nazanin text-[20px] font-semibold">
        <ul className="flex justify-center items-center p-2 m-2 gap-5">
          <li>
            <Link href="/">خانه</Link>
          </li>
          <li>
            <Link href="/pages/cpanel">پنل کاربری</Link>
          </li>
          <li>
            <Link href="/pages/plan">دریافت برنامه</Link>
          </li>
          <li>
            <Link href="/"></Link>
          </li>
        </ul>
      </div>
      {/* Center side */}
      <div className="flex justify-center items-center p-3 w-1/3">
        <h1 className="font-fantasy">Mega Gym</h1>
      </div>
      {/* Right Side */}
      <div className="flex justify-end items-center p-3 w-1/3 font-nazanin text-[20px] font-semibold">
        <ul className="flex justify-center items-center p-2 m-2 gap-5">
          <li>
            {isAuthenticated ? (
              <button onClick={handleLogout}>خروج</button>
            ) : (
              <Link href="/pages/signup">ثبت نام</Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
