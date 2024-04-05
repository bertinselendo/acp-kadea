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
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { buttonVariants } from "../ui/button";
import { cn, sanitizeFiles } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EmojiPicker } from "../ui/emoji-picker";
import { ChatMessageType } from "./messagePanel";
import { useMutation } from "@tanstack/react-query";
import { User } from "@prisma/client";
import dayjs from "dayjs";
import { toast } from "sonner";
import Image from "next/image";
import { useProjectUpload } from "@/hooks/useUpload";

type chatFormProps = {
  projectID: string;
  user: User;
  projectChatsRef: any;
  setChatFormHeight: React.Dispatch<React.SetStateAction<number>>;
};

export default function ChatForm({
  projectID,
  user,
  projectChatsRef,
  setChatFormHeight,
}: chatFormProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatFormRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<File[]>([]);
  const [docs, setDocs] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string[]>([]);

  const { onUpload, progresspercent, uploadProjectFiles } = useProjectUpload();

  useEffect(() => {
    const files: string[] = [];
    const promises = images.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          files.push(reader.result as string);
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(() => {
      setFilePreview(files);
    });

    // wait animations end for exact height value
    setTimeout(() => {
      if (chatFormRef.current) {
        setChatFormHeight(chatFormRef.current?.clientHeight);
      }
    }, 500);
  }, [images, setChatFormHeight]);

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
    if (!user) return;

    const newMessage: ChatMessageType = {
      createAt: serverTimestamp(),
      userID: user.id,
      name: `${user?.firstName}`,
      message: message,
      images: [],
      documents: [],
    };

    if (images.length > 0) {
      const res = await uploadProjectFiles(images, projectID, "chat");
      newMessage.images = res;
    }

    if (docs.length > 0) {
      const res = await uploadProjectFiles(docs, projectID, "chat");
      newMessage.documents = res;
    }

    await chatMutation.mutateAsync(newMessage);

    // reset all
    setMessage("");
    setImages([]);
    setDocs([]);

    if (inputRef.current) {
      inputRef.current.focus();
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

  const handleImageFile = (event: React.ChangeEvent<any>) => {
    const maxSize = 5000000;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const validFiles = sanitizeFiles(event, maxSize, allowedTypes, 8);
    setImages(validFiles.concat(images));
  };

  const handlerDocFile = (event: React.ChangeEvent<any>) => {
    const maxSize = 5000000;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const validFiles = sanitizeFiles(event, maxSize, allowedTypes, 4);
    setDocs(docs.concat(validFiles));
  };

  const handleRemoveKey = (indexToRemove: number) => {
    const updatedItems = images.filter(
      (item, index) => index !== indexToRemove
    );
    setImages(updatedItems);
  };

  const handleDocRemoveKey = (indexToRemove: number) => {
    const updatedItems = docs.filter((item, index) => index !== indexToRemove);
    setDocs(updatedItems);
  };

  return (
    <>
      <div
        className="w-0 h-1 rounded-lg bg-green-500"
        style={onUpload ? { width: `${progresspercent}%` } : {}}
      ></div>
      <div
        ref={chatFormRef}
        className={`p-2 flex flex-col justify-between w-full items-center gap-0 ${
          chatMutation.isPending ||
          (onUpload && "animate-pulse pointer-events-none")
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
            <motion.div
              key="send"
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
              {message.trim() || images.length || docs.length ? (
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
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-4 grid-flow-row gap-2 mt-2">
          <AnimatePresence>
            {filePreview &&
              filePreview.map((image, index) => (
                <motion.div
                  key={index}
                  className="rounded-lg relative"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.3,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                >
                  <X
                    className="absolute z-10 top-0 right-0 w-5 transition-all text-red-500 hover:scale-110"
                    onClick={() => handleRemoveKey(index)}
                  />
                  <Image
                    src={image}
                    alt=""
                    width="200"
                    height="200"
                    className="aspect-video rounded-lg object-cover bg-white shadow-sm"
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
        <div className="flex flex-col w-full gap-2 mt-2">
          <AnimatePresence>
            {filePreview &&
              docs.map((doc, index) => (
                <motion.div
                  key={index}
                  className="rounded-lg relative bg-background px-3 py-1 border w-10/12"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.3,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                >
                  <X
                    className="absolute z-10 top-[2px] right-2 w-5 transition-all text-red-500 hover:scale-110"
                    onClick={() => handleDocRemoveKey(index)}
                  />
                  <p className="text-sm">{doc.name}</p>
                </motion.div>
              ))}
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
            <label
              htmlFor="img"
              onChange={handleImageFile}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <FileImage size={20} className="text-muted-foreground" />
              <input
                type="file"
                id="img"
                name="img"
                accept=".jpg, .jpeg, .png, .webp"
                multiple
                hidden
              />
            </label>
            <label
              htmlFor="doc"
              onChange={handlerDocFile}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <Paperclip size={20} className="text-muted-foreground" />
              <input
                type="file"
                id="doc"
                name="doc"
                accept=".pdf, .doc, .docx"
                multiple
                hidden
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
