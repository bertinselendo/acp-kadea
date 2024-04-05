"use client";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import HeaderUserPoper from "./header/headerUser";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type HeaderProps = {
  user: any;
};

export default function Header(props: HeaderProps) {
  const [pageTitle, setPageTitle] = useState("");
  const url = usePathname();
  const router = useRouter();

  useEffect(() => {
    setPageTitle(document.title);
  }, [url]);

  return (
    <>
      <div className="w-4/12 flex gap-2 items-center">
        <Link href="#" onClick={() => router.back()}>
          <ChevronLeft />
        </Link>
        <AnimatePresence>
          {pageTitle && (
            <motion.h1
              key="htitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="text-2xl font-bold truncate"
            >
              {pageTitle}
            </motion.h1>
          )}
        </AnimatePresence>
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
    </>
  );
}
