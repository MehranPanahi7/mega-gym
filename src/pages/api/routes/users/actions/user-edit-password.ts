import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db/prisma";

interface DecodedToken {
  user_id: number;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function EditUserPasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // بررسی وجود JWT SECRET
  if (!JWT_SECRET)
    return res
      .status(500)
      .json({ message: "خطای سرور: JWT_SECRET تنظیم نشده است" });
  // بررسی مجاز بودن متد
  if (req.method !== "PATCH")
    return res.status(405).json({ message: "Method is not Allowed!" });

  const { newPassword } = req.body;
  if (!newPassword)
    return res.status(401).json({ message: "رمزعبور جدید باید وارد شود." });

  // دریافت توکن از کوکی
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "توکن نامعتبر است." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const user_id = decoded.user_id;
    if (!user_id)
      return res.status(401).json({ message: "ابتدا باید وارد شوید." });

    // بررسی تعداد تغییرات در 7 روز اخیر
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const changeCount = await prisma.password_changes.count({
      where: {
        user_id,
        changed_at: {
          gte: oneWeekAgo,
        },
      },
    });

    if (changeCount >= 3)
      return res.status(429).json({
        message: "شما فقط 3 بار در هفته میتوانید رمز عبور را تغییر دهید.",
      });

    // هش کردن رمز عبور
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // تغییر رمز عبور
    await prisma.users.update({
      where: { user_id: user_id },
      data: { user_password: newHashedPassword },
    });

    //ثبت لاگ تغییر رمز عبور
    await prisma.password_changes.create({
      data: {
        user_id,
      },
    });

    res.status(200).json({ message: "رمزعبور با موفقیت ویرایش شد." });
  } catch (error) {
    console.error("Internal Server Error", error);
    return res
      .status(500)
      .json({ message: "خطا هنگام برقراری ارتباط با سرور رخ داده است." });
  }
}
