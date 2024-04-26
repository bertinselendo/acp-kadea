"use client";

import UserAvatar from "@/components/auth/UserAvatar";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IoEllipsisHorizontal, IoEllipsisVertical } from "react-icons/io5";

type sidebarUserProps = {
  src: string;
};

export default function SidebarUser(props: sidebarUserProps) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 767px)");
  const isPc = useMediaQuery("(min-width : 768px)");

  return (
    <ul className="flex flex-col">
      <li
        className={cn(
          navigationMenuTriggerStyle(),
          "h-10 w-10 p-0 md:h-14 md:w-14",
        )}
      >
        <Link href="#">
          {isSmallDevice && <IoEllipsisVertical size="1.6em" />}
          {isPc && <IoEllipsisHorizontal size="2em" />}
        </Link>
      </li>
      {isPc && (
        <li className={cn(navigationMenuTriggerStyle(), "h-14 w-14 p-0")}>
          <Link href="/account">
            <UserAvatar src={props.src} />
          </Link>
        </li>
      )}
    </ul>
  );
}
