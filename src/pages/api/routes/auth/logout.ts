import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default function Logout(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method is not Allowed" });

  try {
    res.setHeader(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      })
    );

    res.status(200).json({ message: "خروج موفقیت آمیز بود." });
  } catch (error) {
    console.log("Internal Server Error", error);
    return res.status(500).json({ message: "خطای سرور رخ داده است." });
  }
}
