"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatMessageType } from "./messagePanel";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { User } from "@prisma/client";
import { UserDiceAvater } from "../auth/userDiceAvater";
import { getProjectAllUsers } from "../admin/projects/project.action";
import { Skeleton } from "../ui/skeleton";

type PropsType = {
  chats: [ChatMessageType];
  projectID: string | string[];
};

export default function ChatList({ chats, projectID }: PropsType) {
  const [projectUsers, setProjectUsers] = useState<any>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chats, projectUsers]);

  useQuery({
    queryKey: ["projectUsers"],
    queryFn: async () => {
      const users = await getProjectAllUsers(`${projectID}`);
      if (users) setProjectUsers(users);
      return users;
    },
  });

  const getUserData = (userID: string) => {
    const user = projectUsers?.filter(
      (teamUser: User) => teamUser.id === userID
    );
    if (user) return user[0];
  };

  if (!projectUsers) {
    return (
      <div className="space-y-4">
        <div className="flex gap-3 items-top w-full">
          <div className="w-full flex flex-col gap-1 items-end">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-full h-16" />
          </div>
          <Skeleton className="w-10 h-10 aspect-square rounded-full" />
        </div>
        <div className="flex gap-3 items-top w-full">
          <Skeleton className="w-10 h-10 aspect-square rounded-full" />
          <div className="w-full flex flex-col gap-1">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-full h-12" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
    >
      <AnimatePresence>
        {chats?.map((message, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
            transition={{
              opacity: { duration: 0.1 },
              layout: {
                type: "spring",
                bounce: 0.3,
                duration: chats.indexOf(message) * 0.05 + 0.2,
              },
            }}
            style={{
              originX: 0.5,
              originY: 0.5,
            }}
            className={cn(
              "flex flex-col gap-2 px-4 py-2 whitespace-pre-wrap",
              getUserData(message.userID)?.role !== "CLIENT"
                ? "items-end"
                : "items-start"
            )}
          >
            <div className="flex gap-3 items-top w-full">
              {getUserData(message.userID)?.role === "CLIENT" && (
                <Avatar className="flex justify-center items-center shadow-lg">
                  <AvatarImage src={getUserData(message?.userID)?.avatar} />
                  <AvatarFallback>
                    <UserDiceAvater
                      email={getUserData(message?.userID)?.email}
                    />
                  </AvatarFallback>
                </Avatar>
              )}
              <span
                className={cn(
                  "flex flex-col w-full",
                  getUserData(message.userID)?.role !== "CLIENT"
                    ? "items-end"
                    : "items-start"
                )}
              >
                <h6 className="text-xs">
                  {message.name} ·{" "}
                  {dayjs(message.createAt?.toMillis()).fromNow()}
                </h6>
                <p
                  className={cn(
                    "p-3 rounded-md max-w-xs text-sm ",
                    getUserData(message.userID)?.role !== "CLIENT"
                      ? "rounded-tr-none bg-primary"
                      : "rounded-tl-none bg-accent"
                  )}
                >
                  {message.message}
                </p>
                <div className="grid grid-cols-2 grid-flow-row gap-2 mt-2 w-max">
                  {message?.images &&
                    message?.images.map((media, index) => (
                      <div key={index}>
                        <Image
                          src={media}
                          alt={message.name}
                          width="100"
                          height="100"
                          className="aspect-video border rounded-lg"
                        />
                      </div>
                    ))}
                  {message?.documents &&
                    message?.documents.map((document, index) => (
                      <div
                        key={index}
                        className="aspect-video border rounded-lg flex items-center justify-center"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FileText />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{document}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                </div>
              </span>
              {getUserData(message.userID)?.role !== "CLIENT" && (
                <Avatar className="flex justify-center items-center shadow-lg">
                  <AvatarImage src={getUserData(message?.userID)?.avatar} />
                  <AvatarFallback>
                    <UserDiceAvater
                      email={getUserData(message?.userID)?.email}
                    />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
