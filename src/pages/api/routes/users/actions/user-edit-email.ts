import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db/prisma";

interface DecodedToken {
  user_id: number;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function EditEmailActionHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // بررسی وجود JWT SECRET
  if (!JWT_SECRET)
    return res
      .status(500)
      .json({ message: "خطای سرور: JWT_SECRET تنظیم نشده است" });

  // بررسی درست بودن متد
  if (req.method !== "PATCH")
    return res.status(405).json({ mssage: "Method not allowed" });

  const { newEmail } = req.body;
  if (!newEmail)
    return res.status(401).json({ message: "مقدار جدید ایمیل را وارد کنید." });

  // دریافت توکن از کوکی
  const token = req.cookies.token;
  if (!token) return res.status(404).json({ message: "توکن نامعتبر است." });

  try {
    // دیکود کردن توکن
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const user_id = decoded.user_id;
    if (!user_id) return res.status(404).json({ message: "کاربر پیدا نشد." });

    // بررسی تعداد تغییرات در 7 روز اخیر
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const changeCount = await prisma.email_changes.count({
      where: {
        user_id,
        changed_at: {
          gte: oneWeekAgo,
        },
      },
    });

    if (changeCount >= 3)
      return res.status(429).json({
        message: "شما فقظ 3 بار در هفته میتوانید ایمیل را تغییر دهید.",
      });

    // کوئری تغییر ایمیل
    const editEmail = await prisma.users.update({
      where: {
        user_id: user_id,
      },
      data: {
        user_email: newEmail,
      },
    });

    //ثبت لاگ تغییر
    await prisma.email_changes.create({
      data: { user_id },
    });

    res.status(200).json({
      message: "ایمیل کاربر با موفقیت تغییر پیدا کرد.",
      newEmail: editEmail.user_email,
    });
  } catch (error) {
    console.error("Internal Server Error", error);
    return res
      .status(500)
      .json({ message: "خطای سرور رخ داده است لطفا دوباره امتحان کنید." });
  }
}
