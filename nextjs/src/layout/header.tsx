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

  useEffect(() => {
    setPageTitle(document.title);
  }, [url]);

  useEffect(() => {
    onSnapshot(
      query(
        notificationRef,
        where("userEmail", "==", `${props.user?.email}`),
        orderBy("date", "desc")
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
      }
    );
  }, []); //eslint-disable-line

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
          <li
            className={cn(
              navigationMenuTriggerStyle(),
              "h-10 w-10 p-0 relative"
            )}
          >
            <Popover>
              <PopoverTrigger>
                <div className="w-[16px] h-[16px] p-0 flex justify-center items-center absolute top-0 right-1 bg-[#eb5757] text-white rounded-full text-[9px]">
                  {notiCount}
                </div>
                <IoNotificationsOutline size="2em" />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-[400px] p-2 h-[600px] overflow-y-scroll"
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
