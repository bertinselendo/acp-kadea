"use client";

import UserAvatar from "@/components/auth/UserAvatar";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IoEllipsisHorizontal } from "react-icons/io5";

type sidebarUserProps = {
  src: string;
};

export default function SidebarUser(props: sidebarUserProps) {
  return (
    <ul className="flex flex-col">
      <li className={cn(navigationMenuTriggerStyle(), "h-14 w-14 p-0")}>
        <Link href="#">
          <IoEllipsisHorizontal size="2em" />
        </Link>
      </li>
      <li className={cn(navigationMenuTriggerStyle(), "h-14 w-14 p-0")}>
        <Link href="/account">
          <UserAvatar src={props.src} />
        </Link>
      </li>
    </ul>
  );
}
