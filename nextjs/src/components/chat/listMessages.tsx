"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, FileText } from "lucide-react";
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
import Link from "next/link";
import ChatForm from "./chatForm";
import { IoDocumentText } from "react-icons/io5";

type PropsType = {
  chats: [ChatMessageType];
  projectID: string | string[];
  user: User;
  projectChatsRef: any;
};

export default function ChatList({
  chats,
  projectID,
  user,
  projectChatsRef,
}: PropsType) {
  const [projectUsers, setProjectUsers] = useState<User[] | null>(null);
  const [chatFormHeight, setChatFormHeight] = useState(0);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chats, projectUsers, chatFormHeight]);

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
      (teamUser: User) => teamUser.id === userID,
    );
    if (user) return user[0];
  };

  // if projectUsers or chats null, show skeleton
  if (!projectUsers || !chats) {
    return (
      <div className="sticky top-12 space-y-4 px-2 md:px-0">
        <div className="items-top flex w-full gap-3">
          <div className="flex w-full flex-col items-end gap-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="aspect-square h-10 w-10 rounded-full" />
        </div>
        <div className="items-top flex w-full gap-3">
          <Skeleton className="aspect-square h-10 w-10 rounded-full" />
          <div className="flex w-full flex-col gap-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={messagesContainerRef}
        className="relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden scroll-smooth"
        style={
          chatFormHeight ? { paddingBottom: `${chatFormHeight + 50}px` } : {}
        }
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
                "flex flex-col gap-2 whitespace-pre-wrap px-2 py-2 md:px-4",
                getUserData(message.userID)?.role !== "CLIENT"
                  ? "items-end"
                  : "items-start",
              )}
            >
              <div className="items-top flex w-full gap-3">
                {getUserData(message.userID)?.role === "CLIENT" && (
                  <Avatar className="flex items-center justify-center shadow-lg">
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
                    "flex w-full flex-col",
                    getUserData(message.userID)?.role !== "CLIENT"
                      ? "items-end"
                      : "items-start",
                  )}
                >
                  <h6 className="text-xs">
                    {message.name} ·{" "}
                    {dayjs(message.createAt?.toMillis()).fromNow()}
                  </h6>
                  {message.message && (
                    <p
                      className={cn(
                        "max-w-xs rounded-md p-3 text-sm ",
                        getUserData(message.userID)?.role !== "CLIENT"
                          ? "rounded-tr-none bg-primary"
                          : "rounded-tl-none bg-accent",
                      )}
                    >
                      {message.message}
                    </p>
                  )}
                  <div
                    className={cn(
                      "mt-2 flex w-8/12 flex-wrap gap-x-[1%] gap-y-1 *:w-[49%]",
                      getUserData(message.userID)?.role !== "CLIENT"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    {message?.images &&
                      message?.images.map((media, index) => (
                        <div key={index}>
                          <Link href={media} className="relative w-full">
                            <div className="group absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center rounded-lg transition-all hover:bg-black/20">
                              <ExternalLink className="w-5 text-white opacity-0 transition-all group-hover:opacity-95" />
                            </div>
                            <Image
                              src={media}
                              alt={message.name}
                              width="100"
                              height="100"
                              className="relative aspect-video w-full rounded-lg border object-cover"
                            />
                          </Link>
                        </div>
                      ))}
                    {message?.documents &&
                      message?.documents.map((document, index) => (
                        <div
                          key={index}
                          className="aspect-video rounded-lg border"
                        >
                          <TooltipProvider delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger
                                asChild
                                className="flex h-full w-full items-center justify-center"
                              >
                                <Link href={document}>
                                  <IoDocumentText className="h-8 w-8 text-primary" />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent className="w-80">
                                <p>{document}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                  </div>
                </span>
                {getUserData(message.userID)?.role !== "CLIENT" && (
                  <Avatar className="flex items-center justify-center shadow-lg">
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
        {!chats?.length && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1">
            <p className="text-2xl">🤗</p>
            <p>Be first to write</p>
          </div>
        )}
      </div>
      <div
        ref={chatFormRef}
        className="absolute bottom-8 z-20 mr-2 w-full rounded-lg bg-secondary md:bottom-0"
      >
        <ChatForm
          projectID={`${projectID}`}
          user={user}
          projectChatsRef={projectChatsRef}
          setChatFormHeight={setChatFormHeight}
        />
      </div>
    </>
  );
}
