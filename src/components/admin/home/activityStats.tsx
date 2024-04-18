"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRightFromSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { notificationType } from "@/components/notifications/notifications-types";
import { limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { notificationRef } from "@/components/notifications/notifications-ref";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";
import { getEventTypeString } from "@/components/notifications/event-type";
import dayjs from "dayjs";
import { getUser } from "../clients/clients.action";

export function ActivityStats({ user }: { user: User }) {
  const [notifications, setNotifications] = useState<notificationType[] | null>(
    null
  );
  const [senderDatas, setSenderDatas] = useState({});

  useEffect(() => {
    onSnapshot(
      query(
        notificationRef,
        where("userEmail", "==", `${user.email}`),
        orderBy("date", "desc"),
        limit(3)
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

  return (
    <>
      {notifications?.map((notification, index) => (
        <Card key={index} className="transition opacity-80 hover:opacity-100">
          <CardContent className="flex items-center justify-center p-4 w-full h-full">
            <Link
              href={notification?.link ?? "#"}
              className="flex flex-col gap-2 w-full h-full"
            >
              <div className="flex gap-2 items-center">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={senderDatas[notification?.senderEmail]?.avatar}
                  />
                  <AvatarFallback>
                    <UserDiceAvater email={notification.senderEmail} />
                  </AvatarFallback>
                </Avatar>
                <div className="text-xs leading-3 *:truncate">
                  <p>
                    <b>{notification?.senderName}</b>{" "}
                    {getEventTypeString(notification?.type)}
                  </p>
                  <p>{dayjs(notification?.date?.toMillis()).fromNow()}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="px-2 py-[2px] border-l-4 border-yellow-500 font-semibold bg-yellow-500/5 truncate">
                  {notification?.reference}
                </div>
                <p>{notification?.text}</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
      <Card
        style={{
          background: `linear-gradient(#EDEFF5, #fff)`,
        }}
        className="transition opacity-80 hover:opacity-100"
      >
        <CardContent className="flex items-center justify-center p-4 w-full h-full">
          <Link
            href="/admin/activity"
            className="flex flex-col gap-2 w-full items-center justify-center h-full"
          >
            <ArrowUpRightFromSquare />
            <div className="text-sm font-semibold">Show Activity</div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}
