"use client";

import { query, collection, onSnapshot, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useEffect, useState } from "react";
import ListMessages from "./listMessages";
import { useParams } from "next/navigation";
import { User } from "@prisma/client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "../ui/button";
import { MessageSquareText, X } from "lucide-react";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);
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
        setChats(chats);
        return chats;
      },
    );
  }, []); //eslint-disable-line

  if (isDesktop) {
    return (
      <div className="relative flex h-full flex-col">
        <div className="z-20 flex gap-2 p-0 py-2">
          <h4 className="p-0 text-xl font-bold">Discutions</h4>
        </div>
        <div className="z-10 h-full">
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

  if (isMobile) {
    return (
      <Popover onOpenChange={() => (open ? setOpen(false) : setOpen(true))}>
        <PopoverTrigger asChild className="fixed bottom-16 right-2">
          <Button variant="outline" size="icon">
            {open ? (
              <X className="h-4 w-4" />
            ) : (
              <MessageSquareText className="h-4 w-4" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-30 mr-2 h-[80vh] w-[95vw] overflow-hidden p-1">
          <div className="z-20 flex gap-2 p-2">
            <h4 className="p-0 text-xl font-bold">Discutions</h4>
          </div>
          <div className="relative z-10 h-full">
            <ListMessages
              chats={chats}
              projectID={projectID}
              user={props.user}
              projectChatsRef={projectChatsRef}
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  }
}
