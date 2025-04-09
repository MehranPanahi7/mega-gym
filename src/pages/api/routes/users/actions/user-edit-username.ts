// api/routes/users/actions/user-edit-username.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db/prisma";

interface DecodedToken {
  user_id: number;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function EditUsernameHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // بررسی JWT Secret
  if (!JWT_SECRET)
    return res
      .status(500)
      .json({ message: "خطای سرور: JWT_SECRET تنظیم نشده است" });

  // بررسی متد
  if (req.method !== "PATCH")
    return res.status(405).json({ message: "Method is not Allowed!" });

  const { newUsername } = req.body;

  // دریافت توکن از کوکی
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "توکن نامعتبر است." });

  // اجرای دستورات
  try {
    // دیکود کردن توکن
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const user_id = decoded.user_id;
    if (!user_id) return res.status(404).json({ message: "کاربر پیدا نشد." });

    const editUsername = await prisma.users.update({
      where: { user_id: user_id },
      data: { username: newUsername },
    });

    res.status(200).json({
      message: "نام کاربری با موفقیت ویرایش شد.",
      newUsername: editUsername,
    });
  } catch (error) {
    console.error("Internal Server Error", error);
    return res
      .status(500)
      .json({ message: "خطای سرور رخ داده است. دوباره تلاش کنید" });
  }
}
