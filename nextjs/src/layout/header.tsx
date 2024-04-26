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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationsList from "@/components/notifications/notificationsList";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { onSnapshot, orderBy, query, where } from "firebase/firestore";
import { notificationRef } from "@/components/notifications/notifications-ref";
import { useMediaQuery } from "@/hooks/use-media-query";

type HeaderProps = {
  user: any;
  clientID: string;
};

export default function Header(props: HeaderProps) {
  const [pageTitle, setPageTitle] = useState("");
  const url = usePathname();
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user as User;
  const [notiCount, setNotiCount] = useState(0);

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  useEffect(() => {
    setPageTitle(document.title);
  }, [url]);

  useEffect(() => {
    onSnapshot(
      query(
        notificationRef,
        where("userEmail", "==", `${props.user?.email}`),
        orderBy("date", "desc"),
      ),
      (querySnapshot) => {
        const noti: any = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.id = `${doc.id}`;
          noti.push(data);
        });
        const notiCount = noti.filter((item) => item.isRead === false);
        setNotiCount(notiCount.length);
        return noti;
      },
    );
  }, []); //eslint-disable-line

  return (
    <>
      <div className="flex w-8/12 items-center gap-2 md:w-4/12">
        <Link href="#" onClick={() => router.back()}>
          <ChevronLeft size={isSmallDevice ? "1.6em" : "2em"} />
        </Link>
        <AnimatePresence>
          {pageTitle && (
            <motion.h1
              key="htitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="truncate text-lg font-bold md:text-2xl"
            >
              {pageTitle}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
      <div className="hidden w-4/12 justify-center md:flex">
        <Skeleton className="h-10 w-[250px]" />
      </div>
      <div className="flex w-4/12 justify-end">
        <ul className="flex items-center gap-2 md:gap-4">
          <li
            className={cn(
              navigationMenuTriggerStyle(),
              "relative h-8 w-8 p-0 md:h-10 md:w-10",
            )}
          >
            <Popover>
              <PopoverTrigger>
                <div className="absolute right-1 top-0 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#eb5757] p-0 text-[9px] text-white">
                  {notiCount}
                </div>
                <IoNotificationsOutline
                  size={isSmallDevice ? "1.6em" : "2em"}
                />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="mx-[2vw] h-[600px] w-[95vw] overflow-y-scroll p-2 md:mx-0 md:w-[400px]"
              >
                <NotificationsList user={user} />
              </PopoverContent>
            </Popover>
          </li>
          <li className="flex">
            <HeaderUserPoper user={props.user} clientID={props.clientID} />
          </li>
        </ul>
      </div>
    </>
  );
}
