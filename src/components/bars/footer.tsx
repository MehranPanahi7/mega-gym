import Link from "next/link";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="flex justify-between items-center w-full bg-white p-4">
      <div className="flex justify-start items-center w-1/2">
        <ul className="flex justify-center items-center p-4">
          <li className="mx-2">
            <Link href="/" target="_blank">
              <FaInstagram size={30} />
            </Link>
          </li>
          <li className="mx-2">
            <Link href="/" target="_blank">
              <FaTelegramPlane size={30} />
            </Link>
          </li>
          <li className="mx-2">
            <Link href="/" target="_blank">
              FaInstagram
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
