import prisma from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export default async function SignUpHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not Allowed!" });

  const { username, user_email, user_password } = req.body;
  if (!username || !user_email || !user_password)
    return res.status(400).json({ message: "مقادیر باید وارد شوند." });

  try {
    // هش کردن رمز عبور
    const hashingPassword = await bcrypt.hash(user_password, 10);

    // بررسی وجود کاربر
    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ username }, { user_email }] },
    });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "کاربر با مشخصات وارد شده قبلا ثبت نام شده است." });

    // ساخت حساب کاربری جدید
    const newUser = await prisma.users.create({
      data: { username, user_email, user_password: hashingPassword },
    });

    // ایجاد توکن
    const token = jwt.sign(
      {
        user_id: newUser.user_id,
        username: newUser.username,
        user_email: newUser.user_email,
      },
      JWT_SECRET,
      { expiresIn: "7h" }
    );

    // تنظیم کوکی ایمن
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 60 * 60,
      })
    );

    return res.status(201).json({
      message: "حساب کاربری با موفقیت ساخته شد.",
      token,
    });
  } catch (error) {
    console.log("Error on Server", error);
    return res.status(500).json({ message: "خطای سرور رخ داده است." });
  }
}
