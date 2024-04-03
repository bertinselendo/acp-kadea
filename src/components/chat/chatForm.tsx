"use client";

import { addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { nanoid } from "nanoid";

import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  Smile,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import React, { useContext, useRef, useState } from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EmojiPicker } from "../ui/emoji-picker";
import { ChatMessageType } from "./messagePanel";
import { useMutation } from "@tanstack/react-query";
import { User } from "@prisma/client";
import dayjs from "dayjs";

export default function ChatForm({
  chats,
  setChats,
  user,
  projectChatsRef,
}: {
  chats: [ChatMessageType];
  setChats: any;
  user: User;
  projectChatsRef: any;
}) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const chatMutation = useMutation({
    mutationFn: async (message: ChatMessageType) => {
      return await addDoc(projectChatsRef, message);
    },
  });

  const handleThumbsUp = async () => {
    if (!user) return;

    const newMessage: ChatMessageType = {
      createAt: serverTimestamp(),
      userID: user.id,
      name: `${user?.firstName}`,
      message: "👍",
      images: [],
      documents: [],
    };

    await chatMutation.mutateAsync(newMessage);
    setMessage("");
  };

  const handleSend = async () => {
    if (message.trim()) {
      if (!user) return;

      const newMessage: ChatMessageType = {
        createAt: serverTimestamp(),
        userID: user.id,
        name: `${user?.firstName}`,
        message: message,
        images: [],
        documents: [],
      };

      await chatMutation.mutateAsync(newMessage);
      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div
      className={`p-2 flex flex-col justify-between w-full items-center gap-0 ${
        chatMutation.isPending && "animate-pulse pointer-events-none"
      }`}
    >
      <div className="flex w-full gap-1">
        <AnimatePresence initial={false}>
          <motion.div
            key="input"
            className="w-full relative"
            layout
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.05 },
              layout: {
                type: "spring",
                bounce: 0.15,
              },
            }}
          >
            <Textarea
              autoComplete="off"
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              name="message"
              placeholder="Aa"
              className=" w-full border rounded-lg flex items-center h-9 resize-none overflow-hidden bg-background"
            ></Textarea>
            <div className="absolute right-2 bottom-0.5  ">
              <EmojiPicker
                onChange={(value) => {
                  setMessage(message + value);
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              />
            </div>
          </motion.div>

          {message.trim() ? (
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
              )}
              onClick={handleSend}
            >
              <SendHorizontal size={20} className="text-muted-foreground" />
            </Link>
          ) : (
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
              )}
              onClick={handleThumbsUp}
            >
              <ThumbsUp size={20} className="text-muted-foreground" />
            </Link>
          )}
        </AnimatePresence>
      </div>
      <div className="flex w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <PlusCircle size={20} className="text-muted-foreground" />
            </Link>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-full p-2">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <Mic size={20} className="text-muted-foreground" />
            </Link>
          </PopoverContent>
        </Popover>
        <div className="flex">
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
            )}
          >
            <FileImage size={20} className="text-muted-foreground" />
          </Link>
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
            )}
          >
            <Paperclip size={20} className="text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}
