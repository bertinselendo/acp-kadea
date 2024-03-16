"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

type menuType = {
  title: string;
  href: string;
};

const menus: menuType[] = [
  {
    title: "About",
    href: "#",
  },
  {
    title: "Privacy",
    href: "#",
  },
  {
    title: "Terms",
    href: "#",
  },
];

export default function FooterMenu() {
  return (
    <ul className="flex gap-4">
      {menus.map((menu: menuType, index: number) => (
        <li key={index} className="text-xs opacity-90 my-2">
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
  );
}
