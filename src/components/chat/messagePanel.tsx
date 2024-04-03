"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import ChatForm from "./chatForm";
import ListMessages from "./listMessages";
import { messagesData } from "./data";

export type ChatListTypes = [
  {
    id: string;
    createAt: string;
    avatar: string;
    name: string;
    message: string;
    images: [string];
    documents: [string];
  }
];

export type MessagePanelProps = {};

export default function MessagePanel(props: MessagePanelProps) {
  const [chats, setChats] = useState<any>(messagesData);

  const chatFormRef = useRef<HTMLDivElement>(null);
  const chatFormHeight = chatFormRef.current?.clientHeight;

  // useEffect(() => {
  //   setChats(messagesData);
  // }, []);

  return (
    <>
      <h4 className="text-xl font-bold mb-2">Discutions</h4>
      <div
        className="h-full z-10"
        style={
          chatFormHeight
            ? { paddingBottom: chatFormHeight + 50 + "px" }
            : { paddingBottom: "160px" }
        }
      >
        <ListMessages chats={chats} />
      </div>
      <div
        ref={chatFormRef}
        className="bg-secondary mr-2 rounded-lg z-20 sticky bottom-1"
      >
        <ChatForm chats={chats} setChats={setChats} />
      </div>
    </>
  );
}
