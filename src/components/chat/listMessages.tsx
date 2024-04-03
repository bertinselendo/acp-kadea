"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatListTypes } from "./messagePanel";

export default function ChatList(props: { chats: ChatListTypes }) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const chats = props.chats;

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chats]);

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
              message.name !== "Jane Doe" ? "items-end" : "items-start"
            )}
          >
            <div className="flex gap-3 items-top w-full">
              {message.name === "Jane Doe" && (
                <Avatar className="flex justify-center items-center shadow-lg">
                  <AvatarImage
                    src={message.avatar}
                    alt={message.name}
                    width={6}
                    height={6}
                  />
                </Avatar>
              )}
              <span
                className={cn(
                  "flex flex-col w-full",
                  message.name !== "Jane Doe" ? "items-end" : "items-start"
                )}
              >
                <h6 className="text-sm">{message.name}</h6>
                <p
                  className={cn(
                    "p-3 rounded-md max-w-xs text-sm ",
                    message.name !== "Jane Doe"
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
                          alt=""
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
              {message.name !== "Jane Doe" && (
                <Avatar className="flex justify-center items-center shadow-lg">
                  <AvatarImage
                    src={message.avatar}
                    alt={message.name}
                    width={6}
                    height={6}
                  />
                </Avatar>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
