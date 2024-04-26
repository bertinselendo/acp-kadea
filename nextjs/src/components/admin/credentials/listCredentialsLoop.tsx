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
    },
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
      <li className="flex w-full animate-pulse gap-4 rounded-lg border bg-transparent p-2 *:h-10">
        <Skeleton className="delay-250 w-1/12" />
        <Skeleton className="delay-250 w-3/12" />
        <Skeleton className="delay-250 w-6/12" />
        <Skeleton className="delay-250 w-2/12" />
      </li>
    );
  }

  if (!credentials.length) {
    return (
      <li className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border bg-transparent p-8 text-center text-sm md:w-[49%]">
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
            <CardContent className="flex flex-wrap items-center justify-start gap-0 rounded-lg px-2 py-1 md:flex-nowrap md:justify-between md:gap-2 md:px-4">
              <div className="mr-2 w-1/12 md:mr-0">
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
                className="btn usename w-10/12 cursor-copy select-all truncate md:w-4/12"
              >
                {credential.username}
              </div>
              <div className="relative w-10/12 overflow-hidden text-nowrap md:w-5/12">
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-r from-transparent to-white"></div>
                <Link href={credential.adminUrl} target="_blank">
                  {credential.adminUrl}
                </Link>
              </div>
              <div className="flex w-2/12 items-center justify-end">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        data-clipboard-text={credential.password}
                        size="icon"
                        variant="outline"
                        className="btn m-0 border-none p-0"
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
                  <DropdownMenuTrigger className="p-0 focus:hidden">
                    <IoEllipsisVertical size="20" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="w-full p-2 text-sm">
                      <div className="mb-1">
                        <Avatar className="h-8 w-8 md:h-8 md:w-8">
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
