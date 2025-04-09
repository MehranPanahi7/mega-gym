import Navbar from "@/components/bars/navbar";
import { metadata } from "./metadata"; // ایمپورت متادیتا
import "./globals.css";
import Providers from "../components/providers/Providers";

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-playwrite">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
