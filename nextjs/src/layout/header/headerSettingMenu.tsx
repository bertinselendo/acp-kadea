"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

type menuType = {
  title: string;
  href: string;
};

const menus: menuType[] = [
  {
    title: "Account",
    href: "/account",
  },
  {
    title: "Support",
    href: "/contact",
  },
  {
    title: "Logout",
    href: "/logout",
  },
];

export default function HeaderSettingMenu() {
  const session = useSession();

  const user = session.data?.user;

  if (!user) {
    return;
  }

  return (
    <>
      <ul>
        {menus.map((menu: menuType, index: number) => (
          <li key={index} className="text-base opacity-90 my-2">
            <Link
              href={menu.href}
              className="cursor-pointer"
              legacyBehavior
              passHref
            >
              {menu.title.charAt(0).toUpperCase() + menu.title.slice(1)}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
