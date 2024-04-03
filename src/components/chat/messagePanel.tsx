"use client";

import {
  query,
  collection,
  onSnapshot,
  FieldValue,
  orderBy,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import ChatForm from "./chatForm";
import ListMessages from "./listMessages";
import { messagesData } from "./data";
import { useParams } from "next/navigation";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { parseDate, relativeDate } from "@/lib/utils";

export type ChatMessageType = {
  createAt: any;
  userID: string;
  name: string;
  message: string;
  images?: [];
  documents?: [];
};

export type MessagePanelProps = {
  user: User;
};

export default function MessagePanel(props: MessagePanelProps) {
  const [chats, setChats] = useState<any>(null);
  const { projectID } = useParams();

  // console.log(chats);

  const projectChatsRef = collection(firestore, `${projectID}`);

  const chatFormRef = useRef<HTMLDivElement>(null);
  const chatFormHeight = chatFormRef.current?.clientHeight;

  useEffect(() => {
    onSnapshot(
      query(projectChatsRef, orderBy("createAt", "asc")),
      (querySnapshot) => {
        const chats: any = [];
        querySnapshot.forEach((doc) => {
          chats.push(doc.data());
        });
        setChats(chats);
        console.log(chats);
        return chats;
      }
    );
  }, []); //eslint-disable-line

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
        <ListMessages chats={chats} projectID={projectID} />
      </div>
      <div
        ref={chatFormRef}
        className="bg-secondary mr-2 rounded-lg z-20 sticky bottom-1"
      >
        <ChatForm
          chats={chats}
          setChats={setChats}
          user={props.user}
          projectChatsRef={projectChatsRef}
        />
      </div>
    </>
  );
}
