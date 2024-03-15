"use client";

import UserAvatar from "@/components/auth/UserAvatar";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";

type HeaderProps = {
  user: any;
};

export default function Header(props: HeaderProps) {
  const [pageTitle, setPageTitle] = useState("");
  const url = usePathname();

  useEffect(() => {
    setPageTitle(document.title);
  }, [url]);

  return (
    <div className="flex justify-between items-center p-3 --border border-b">
      <h1 className="text-2xl font-bold">{pageTitle}</h1>
      <div>
        <Skeleton className="w-[250px] h-10" />
      </div>
      <div>
        <ul className="flex items-center gap-4">
          <li className={cn(navigationMenuTriggerStyle(), "h-10 w-10 p-0")}>
            <IoNotificationsOutline size="2em" />
          </li>
          <li>
            <Link href="#">
              <UserAvatar src={props.user.avatar} />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
