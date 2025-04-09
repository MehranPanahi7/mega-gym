import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface DecodedToken {
  user_id: number;
}

export default async function GetUSerInfos(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!JWT_SECRET)
    return res
      .status(500)
      .json({ message: "خطای سرور: JWT_SECRET تنظیم نشده است" });

  if (req.method !== "GET")
    return res.status(405).json({ message: "Method is not allowed" });

  // دریافت توکن
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "توکن نامعتبر است" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const user_id = decoded.user_id;
    if (!user_id) return res.status(404).json({ message: "کاربر پیدا نشد." });

    const query = await prisma.users.findFirst({
      where: { user_id: user_id },
      select: {
        user_id: true,
        username: true,
        user_email: true,
        user_role: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!query) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }
    return res
      .status(200)
      .json({ message: "اطلاعات کاربر با موفقیت دریافت شد.", user: query });
  } catch (error) {
    console.log("Internal Server Error", error);
    return res.status(500).json({ message: "خطای سرور رخ داده است" });
  }
}
