"use client";

import { clickAnimation } from "@/components/ui/click-animation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ClipboardJS from "clipboard";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseDate, relativeDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Credential, User } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoEllipsisVertical } from "react-icons/io5";
import { useSession } from "next-auth/react";
import {
  BetweenHorizontalStart,
  Globe2,
  KeyRound,
  Link2,
  LockKeyhole,
} from "lucide-react";
import EditCredentialModal from "./editCredentialModal";
import { DeleteCredentialAlert } from "./deleteCredentialAlert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";

type ListCredentialsLoopProps = {
  credentials: [
    Credential & {
      user: User;
    }
  ];
};

export default function ListCredentialsLoop(props: ListCredentialsLoopProps) {
  const credentials = props.credentials;

  useEffect(() => {
    let clipboard = new ClipboardJS(".btn");
    clipboard.on("success", function (e) {
      if (e.trigger.classList["value"].includes("usename")) {
        toast.success(`${e.text} copied`);
      } else {
        toast.success("Password copied");
      }
    });
    return () => {
      clipboard.destroy();
    };
  }, []);

  const { data } = useSession();
  const user = data?.user as User;
  const currentRole = user?.role;

  if (!credentials) {
    return (
      <li className="w-full animate-pulse border bg-transparent rounded-lg p-2 flex gap-4 *:h-10">
        <Skeleton className="w-1/12 delay-250" />
        <Skeleton className="w-3/12 delay-250" />
        <Skeleton className="w-6/12 delay-250" />
        <Skeleton className="w-2/12 delay-250" />
      </li>
    );
  }

  if (!credentials.length) {
    return (
      <li className="w-[49%] border bg-transparent rounded-lg flex flex-col gap-4 text-sm items-center justify-center text-center p-8">
        <p className="text-2xl">😔</p>
        <p>Looks like a client is on a diet - zero credentials detected!</p>
      </li>
    );
  }

  return (
    <>
      {credentials?.map((credential) => (
        <li key={credential.id} className="w-full">
          <Card className="p-1">
            <CardContent className="rounded-lg px-4 py-1 flex gap-2 justify-between items-center">
              <div className="w-1/12">
                {credential.service == "Website" ? (
                  <Globe2 />
                ) : credential.service == "Hosting" ? (
                  <BetweenHorizontalStart />
                ) : credential.service == "Domaine registrar" ? (
                  <Link2 />
                ) : (
                  <KeyRound />
                )}
              </div>
              <div
                data-clipboard-text={credential.username}
                className="btn usename w-4/12 select-all truncate cursor-copy"
              >
                {credential.username}
              </div>
              <div className="w-5/12 text-nowrap overflow-hidden relative">
                <div className="absolute bg-gradient-to-r from-transparent to-white top-0 bottom-0 left-0 right-0 pointer-events-none"></div>
                <Link href={credential.adminUrl} target="_blank">
                  {credential.adminUrl}
                </Link>
              </div>
              <div className="w-2/12 flex items-center justify-end">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        data-clipboard-text={credential.password}
                        size="icon"
                        variant="outline"
                        className="btn border-none p-0 m-0"
                        onClick={clickAnimation}
                      >
                        <LockKeyhole size="20" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy password</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:hidden p-0">
                    <IoEllipsisVertical size="20" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="text-sm w-full text-center py-2">
                      <div className="px-2 mb-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={credential.user?.avatar as string}
                          />
                          <AvatarFallback>
                            <UserDiceAvater email={credential.user?.email} />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {parseDate(credential.createdAt)}
                    </div>
                    <DropdownMenuSeparator />
                    <EditCredentialModal credential={credential} />
                    {(currentRole == "ADMIN" || currentRole == "MANAGER") && (
                      <>
                        <DropdownMenuSeparator />
                        <DeleteCredentialAlert credential={credential} />
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </>
  );
}
