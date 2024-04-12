"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BookmarkCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";
import { User } from "@prisma/client";
import { UserDiceAvater } from "../auth/userDiceAvater";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Badge } from "../ui/badge";
import { getEventTypeString } from "./event-type";
import { getUser } from "../admin/clients/clients.action";

type PropsType = {
  user: User;
};

type notifications = {
  id: string;
  senderEmail: string;
  senderName: string;
  userID: string;
  type: string;
  date: any;
  reference: string;
  text: string;
  link: string;
  isRead: boolean;
};

export default function NotificationsList({ user }: PropsType) {
  const [notifications, setNotifications] = useState<notifications[] | null>(
    null
  );
  const [senderDatas, setSenderDatas] = useState({});

  const notificationRef = collection(firestore, "notifications");

  useEffect(() => {
    onSnapshot(
      query(notificationRef, orderBy("date", "desc")),
      (querySnapshot) => {
        const noti: any = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.id = `${doc.id}`;
          noti.push(data);
        });
        setNotifications(noti);
        return noti;
      }
    );
  }, []); //eslint-disable-line

  useEffect(() => {
    const fetchSenderEmails = async () => {
      if (notifications) {
        const avatar = {};
        await Promise.all(
          notifications.map(async (notification) => {
            const user = await getUser(notification.senderEmail);
            avatar[notification.senderEmail] = user;
          })
        );
        setSenderDatas(avatar);
      }
    };
    fetchSenderEmails();
  }, [notifications]);

  const onMarkRead = async (notiID: string) => {
    const notification = await updateDoc(doc(notificationRef, notiID), {
      isRead: true,
    });
    return notification;
  };

  // if notification null, show skeleton
  if (!notifications) {
    return (
      <>
        <div className="flex gap-2 py-4">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex gap-2 py-4">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-20 w-full" />
        </div>
      </>
    );
  }

  return (
    <div>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="p-4 border-b relative group cursor-pointer hover:bg-secondary transition-all"
        >
          <Badge
            variant="outline"
            className="absolute top-2 right-2 rounded-sm text-sm group-hover:opacity-100 opacity-100 transition-all"
          >
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger className="p-1 aspect-square rounded-sm text-foreground/50 hover:bg-secondary hover:text-foreground/100 transition-all">
                  <BookmarkCheck
                    className="w-5 h-5"
                    onClick={() => onMarkRead(notification.id)}
                  />
                </TooltipTrigger>
                <TooltipContent className="text-sm text-foreground/80 py-1">
                  <p>Mark as read</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Badge>
          <Link href={notification?.link ?? "#"} className="flex gap-2">
            <div className="relative">
              {!notification?.isRead && (
                <div className="w-2 h-2 rounded-full bg-red-700 absolute top-2 -left-3"></div>
              )}
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={senderDatas[notification?.senderEmail]?.avatar}
                />
                <AvatarFallback>
                  <UserDiceAvater email={notification.senderEmail} />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-sm flex flex-col gap-1">
              <p>
                <b>{notification?.senderName}</b>{" "}
                {getEventTypeString(notification?.type)} ·{" "}
                {dayjs(notification?.date?.toMillis()).fromNow()}
              </p>
              <div className="px-2 py-[2px] border-l-4 border-yellow-500 font-semibold bg-yellow-500/5 w-max">
                {notification?.reference}
              </div>
              <p>{notification?.text}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
