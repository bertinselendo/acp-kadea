"use client";

import { query, collection, onSnapshot, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

import { useEffect, useState } from "react";
import ListMessages from "./listMessages";
import { useParams } from "next/navigation";
import { User } from "@prisma/client";

export type ChatMessageType = {
  createAt: any;
  userID: string;
  name: string;
  message: string;
  images?: string[];
  documents?: string[];
};

export type MessagePanelProps = {
  user: User;
};

export default function MessagePanel(props: MessagePanelProps) {
  const [chats, setChats] = useState<any>(null);
  const { projectID } = useParams();

  const projectChatsRef = collection(firestore, `${projectID}`);

  useEffect(() => {
    onSnapshot(
      query(projectChatsRef, orderBy("createAt", "asc")),
      (querySnapshot) => {
        const chats: any = [];
        querySnapshot.forEach((doc) => {
          chats.push(doc.data());
        });
        if (chats.length) setChats(chats);
        return chats;
      }
    );
  }, []); //eslint-disable-line

  return (
    <div className="flex flex-col h-full relative">
      <div className="py-2 flex gap-2 z-20 p-0">
        <h4 className="text-xl font-bold p-0">Discutions</h4>
      </div>
      <div className="h-full z-10">
        <ListMessages
          chats={chats}
          projectID={projectID}
          user={props.user}
          projectChatsRef={projectChatsRef}
        />
      </div>
    </div>
  );
}
