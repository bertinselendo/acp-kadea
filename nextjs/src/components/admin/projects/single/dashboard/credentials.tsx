"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import ClipboardJS from "clipboard";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clickAnimation } from "@/components/ui/click-animation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { parseDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjectCredentials } from "@/components/admin/credentials/credentials.action";
import {
  BetweenHorizontalStart,
  Globe2,
  KeyRound,
  Link2,
  LockKeyhole,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoEllipsisVertical } from "react-icons/io5";
import EditCredentialModal from "@/components/admin/credentials/editCredentialModal";
import { DeleteCredentialAlert } from "@/components/admin/credentials/deleteCredentialAlert";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";

export default function DashCredentials(params: { projectID: string }) {
  const session = useSession();
  const user = session.data?.user as User;
  const currentRole = user?.role;

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

  const { isPending, data } = useQuery({
    queryKey: ["credentials"],
    queryFn: async () => {
      try {
        return await getProjectCredentials(params.projectID);
      } catch (error) {
        throw error;
      }
    },
  });

  if (isPending) {
    return (
      <div>
        <div className="w-full p-2 flex gap-4 *:h-10">
          <Skeleton className="w-8/12" />
          <Skeleton className="w-4/12 delay-250" />
        </div>
        <div className="w-full p-2 flex gap-4 *:h-10">
          <Skeleton className="w-5/12 delay-500" />
          <Skeleton className="w-7/12 delay-750" />
        </div>
      </div>
    );
  }

  if (data?.length) {
    return (
      <div className="h-60 flex flex-col gap-2 overflow-y-scroll pr-1">
        {data?.map((credential) => (
          <div key={credential.id} className="w-full">
            <Card className="p-0 shadow-none">
              <CardContent className="rounded-lg px-4 py-1 flex gap-1 justify-between items-center">
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
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={credential.user?.avatar as string}
                                  />
                                  <AvatarFallback>
                                    <UserDiceAvater
                                      email={credential.user?.email}
                                    />
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent className="shadow-none border">
                                <p>
                                  {credential.user?.firstName +
                                    " " +
                                    credential.user?.lastName}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 h-60 w-full items-center justify-center">
      <p>No credentials</p>
    </div>
  );
}
