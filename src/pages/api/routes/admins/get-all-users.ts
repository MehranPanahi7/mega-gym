import prisma from "@/lib/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface DecodedToken {
  user_id: number;
  role: string;
  username: string;
}

export default async function GetUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  // دریافت توکن
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "توکن ارسال نشده است." });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "توکن نامعتبر است" });

  try {
    // دیکود کردن توکن
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    // بررسی مدیر بودن کاربر
    if (!["admin", "owner"].includes(decoded.role))
      return res.status(403).json({ message: "دسترسی مجاز نمی باشد." });

    // فراخوانی لیست کاربران از دیتابیس
    const users = await prisma.users.findMany({
      select: {
        user_id: true,
        user_role: true,
        username: true,
        user_email: true,
        user_gender: true,
        user_status: true,
      },
      orderBy: { created_at: "desc" },
    });

    res
      .status(200)
      .json({ message: "لیست کاربران با موفقیت دریافت شد", users: users });
  } catch (error) {
    console.log("Internal Server Error", error);
    return res.status(500).json({ message: "خطای سرور رخ داده است." });
  }
}
