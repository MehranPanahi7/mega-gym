import { editEmail } from "@/store/slices/userSlices/user-actions-slices/edit-emailSlice";
import { editUsername } from "@/store/slices/userSlices/user-actions-slices/edit-usernameSlice";
import { editPassword } from "@/store/slices/userSlices/user-actions-slices/edit-userPasswordSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  onClose: () => void;
  field: "username" | "email" | "password" | null;
}

export default function EditInformation({ onClose, field }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  // اسلایس تغییر نام کاربری
  const {
    error: usernameError,
    loading: usernameLoading,
    success: usernameSuccess,
  } = useSelector((state: RootState) => state.editUsername);

  // اسلایس تغییر رمز عبور
  const {
    error: passwordError,
    loading: passwordLoading,
    success: passwordSuccess,
  } = useSelector((state: RootState) => state.editPassword);

  // اسلایس تغییر ایمیل
  const {
    error: emailError,
    loading: emailLoading,
    success: emailSuccess,
  } = useSelector((state: RootState) => state.editEmail);

  // مشخص کردن فیلد برای اسلایس ها
  const error =
    field === "username"
      ? usernameError
      : field === "password"
      ? passwordError
      : emailError;
  const loading =
    field === "username"
      ? usernameLoading
      : field === "password"
      ? passwordLoading
      : emailLoading;
  const success =
    field === "username"
      ? usernameSuccess
      : field === "password"
      ? passwordSuccess
      : emailSuccess;

  const [inputValue, setInputValue] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // متد اعتبار سنجی ورودی ها
  const validateInput = () => {
    if (field === "username" && inputValue.length < 3)
      return "نام کاربری حداقل باید 3 کاراکتر باشد.";

    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue))
      return "ایمیل معتبر نیست.";

    if (field === "password" && inputValue.length < 6) {
      return "رمز عبور باید حداقل ۶ کاراکتر باشد.";
    }
    return null;
  };

  // ذخیره تغییرات
  const handleSave = () => {
    const errorMessage = validateInput();
    if (errorMessage) {
      setValidationError(errorMessage);
      return;
    }

    setValidationError(null);

    if (field === "username")
      dispatch(editUsername({ newUsername: inputValue }));

    if (field === "password")
      dispatch(editPassword({ newPassword: inputValue }));

    if (field === "email") dispatch(editEmail({ newEmail: inputValue }));
  };

  useEffect(() => {
    if (success) onClose();
  }, [onClose, success]);

  return (
    <div className="flex justify-center items-center w-full p-4 md:w-1/2 flex-col bg-white rtl rounded-md">
      <div className="p-2 flex justify-center items-center w-full flex-col">
        <p className="font-nazanin text-[30px] my-3">
          <span>ویرایش </span>
          <span>
            {field === "username"
              ? "نام کاربری"
              : field === "email"
              ? "ایمیل"
              : field === "password"
              ? "رمز عبور"
              : ""}
          </span>
        </p>
        <input
          type="text"
          placeholder="مقدار جدید را وارد کنید"
          className="outline-none p-3 bg-gray-200 w-full rounded-lg"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center w-full p-4 font-nazanin font-bold">
        <button
          className="bg-red-600 outline-none p-3 rounded-md hover:bg-red-500"
          onClick={onClose}
        >
          بستن
        </button>
        <button
          className="bg-green-600 outline-none p-3 rounded-md hover:bg-green-500"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>
      {/* نمایش خطا */}
      {validationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center rtl font-nazanin">
          {validationError}
        </div>
      )}
      {error && !validationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center rtl font-nazanin">
          {error}
        </div>
      )}
      {/* نمایش پیغام موفقیت */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center rtl font-nazanin">
          رمز عبور با موفقیت تغییر پیدا کرد.
        </div>
      )}
    </div>
  );
}
