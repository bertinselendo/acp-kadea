"use client";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import HeaderUserPoper from "./header/headerUser";

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
    <div className="flex justify-between items-center p-3 bg-background dark:bg-black --border border-b sticky top-0 z-50">
      <div className="w-4/12">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>
      <div className="w-4/12 flex justify-center">
        <Skeleton className="w-[250px] h-10" />
      </div>
      <div className="w-4/12 flex justify-end">
        <ul className="flex items-center gap-4">
          <li className={cn(navigationMenuTriggerStyle(), "h-10 w-10 p-0")}>
            <IoNotificationsOutline size="2em" />
          </li>
          <li className="flex">
            <HeaderUserPoper user={props.user} />
          </li>
        </ul>
      </div>
    </div>
  );
}
