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
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Badge } from "../ui/badge";
import { getEventTypeString } from "./event-type";
import { getUser } from "../admin/clients/clients.action";
import { notificationRef } from "./notifications-ref";
import { notificationType } from "./notifications-types";

type PropsType = {
  user: User;
};

export default function NotificationsList({ user }: PropsType) {
  const [notifications, setNotifications] = useState<notificationType[] | null>(
    null,
  );
  const [senderDatas, setSenderDatas] = useState({});

  useEffect(() => {
    onSnapshot(
      query(
        notificationRef,
        where("userEmail", "==", `${user.email}`),
        orderBy("date", "desc"),
      ),
      (querySnapshot) => {
        const noti: any = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.id = `${doc.id}`;
          noti.push(data);
        });
        setNotifications(noti);
        return noti;
      },
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
          }),
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

  if (!notifications.length) {
    return (
      <div className="flex items-center justify-center p-6">No activity</div>
    );
  }

  return (
    <div>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="group relative cursor-pointer border-b p-4 transition-all hover:bg-secondary"
        >
          <Badge
            variant="outline"
            className="absolute right-1 top-2 z-10 rounded-sm bg-background text-sm opacity-100 transition-all group-hover:opacity-100 md:right-2"
          >
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger className="p-0.2 aspect-square rounded-sm text-foreground/50 transition-all hover:bg-secondary hover:text-foreground/100 md:p-1">
                  <BookmarkCheck
                    className="h-4 w-4 md:h-5 md:w-5"
                    onClick={() => onMarkRead(notification.id)}
                  />
                </TooltipTrigger>
                <TooltipContent className="py-1 text-sm text-foreground/80">
                  <p>Mark as read</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Badge>
          <Link href={notification?.link ?? "#"} className="flex gap-2">
            <div className="relative">
              {!notification?.isRead && (
                <div className="absolute -left-3 top-2 h-2 w-2 rounded-full bg-red-700"></div>
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
            <div className="flex flex-col gap-1 text-sm">
              <p>
                <b>{notification?.senderName}</b>{" "}
                {getEventTypeString(notification?.type)} ·{" "}
                {dayjs(notification?.date?.toMillis()).fromNow()}
              </p>
              <div className="w-max border-l-4 border-yellow-500 bg-yellow-500/5 px-2 py-[2px] font-semibold">
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
