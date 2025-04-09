import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/prisma";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function SinginHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(400).json({ message: "Method is not Allowed" });

  const { identifier, password } = req.body;
  if (!identifier || !password)
    return res.status(401).json({ message: "مقادیر باید وارد شوند." });

  try {
    // بررسی وجود کاربر
    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ username: identifier }, { user_email: identifier }] },
    });
    if (!existingUser)
      return res.status(403).json({ message: "کاربر ثبت نام نشده است." });

    // بررسی رمز عبور
    const checkPassword = await bcrypt.compare(
      password,
      existingUser.user_password
    );
    if (!checkPassword)
      return res.status(401).json({ message: "رمز عبور اشتباه است" });

    // ساخت توکن
    const token = jwt.sign(
      {
        user_id: existingUser.user_id,
        username: existingUser.username,
        email: existingUser.user_email,
        role: existingUser.user_role,
      },
      JWT_SECRET,
      { expiresIn: "7h" }
    );

    // تنظیم کوکی ایمن
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 60 * 60,
      })
    );

    res.status(200).json({
      message: "کاربر با موفقیت وارد شد.",
      token: token,
      user: existingUser,
    });
  } catch (error) {
    console.log("Internal Server Error", error);
    return res
      .status(500)
      .json({ message: "خطای سرور رخ داده است لطفا دوباره تلاش کنید." });
  }
}
