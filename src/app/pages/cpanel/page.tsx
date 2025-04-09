"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import EditInformation from "@/components/buttons/edit-buttons/user-panel/edit-button-user-panel";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function UserControlPanelPage() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [editField, setEditField] = useState<
    "username" | "email" | "password" | null
  >(null);

  // دریافت توکن از API
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch("/api/routes/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) return console.log("Error on Fethcing", data.message);
        setUserToken(data.token);
      } catch (error) {
        console.log("Error on Fethcing Token", error);
      }
    };
    fetchToken();
  }, []);

  // تابع دریافت اطلاعات از API
  const fetchUserInfo = async (userToken: string | null) => {
    if (!userToken) throw new Error("توکن یافت نشد. لطفاً وارد شوید.");

    const res = await fetch("/api/routes/users/user-information", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) throw new Error("خطا در دریافت اطلاعات.");
    return data;
  };

  // استفاده از React Query برای دریافت اطلاعات کاربر
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-info", userToken],
    queryFn: () => fetchUserInfo(userToken),
    enabled: !!userToken,
    retry: false,
  });

  if (isLoading) return <p className="text-center">در حال بارگذاری...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center">
        {error.message || "خطا در دریافت اطلاعات"}
      </p>
    );

  if (isAuthenticated) {
    return (
      <div className="flex justify-start items-center p-4 min-w-full">
        <div className="flex p-2 w-full">
          <ul className="font-nazanin font-playwrite rtl w-full flex justify-start items-center flex-col">
            <li className="flex justify-between items-center text-[25px] my-4 bg-purple-400 w-full md:w-1/2 p-4 rounded-xl shadow-xl">
              <div className="flex-1">
                <span className="mx-4">نام کاربری:</span>
                <span>{data?.user.username}</span>
              </div>
              <button
                className="bg-gray-500 outline-none p-4 rounded-lg hover:bg-gray-400"
                onClick={() => {
                  setIsEditing(!isEditing);
                  setEditField("username");
                }}
              >
                ویرایش
              </button>
            </li>
            <li className="flex justify-between items-center text-[25px] my-4 bg-purple-400 w-full md:w-1/2 p-4 rounded-xl shadow-xl">
              <div className="flex-1">
                <span className="mx-4">ایمیل: </span>
                <span>{data?.user.user_email}</span>
              </div>
              <button
                className="bg-gray-500 outline-none p-4 rounded-lg hover:bg-gray-400"
                onClick={() => {
                  setIsEditing(!isEditing);
                  setEditField("email");
                }}
              >
                ویرایش
              </button>
            </li>
            <li className="flex justify-between items-center text-[25px] my-4 bg-purple-400 w-full md:w-1/2 p-4 rounded-xl shadow-xl">
              <div className="flex-1">
                <span className="mx-4">رمز عبور: </span>
                <span>{data?.user.user_password}</span>
              </div>
              <button
                className="bg-gray-500 outline-none p-4 rounded-lg hover:bg-gray-400"
                onClick={() => {
                  setIsEditing(!isEditing);
                  setEditField("password");
                }}
              >
                ویرایش
              </button>
            </li>
          </ul>
        </div>
        {/* مودال ویرایش */}
        {isEditing && (
          <div className="fixed inset-0 flex justify-center items-center bg-opacity-65 bg-black w-full">
            <EditInformation
              onClose={() => setIsEditing(false)}
              field={editField}
            />
          </div>
        )}
      </div>
    );
  }
}
