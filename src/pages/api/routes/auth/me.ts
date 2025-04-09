import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function AuthStatus(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not Allowed" });

  try {
    // دریافت کوکی از هدر درخواست
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ message: "توکن نامعتبر است.", isAuthenticated: false });

    // بررسی اعتبار توکن
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({
      message: "لاگین است.",
      isAuthenticated: true,
      user: decoded,
      token: token,
    });
  } catch (error) {
    console.log("Internal Server Error", error);
    return res.status(500).json({ message: "خطای سرور رخ داده است." });
  }
}
