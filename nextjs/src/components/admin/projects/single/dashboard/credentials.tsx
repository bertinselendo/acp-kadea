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
import { useMediaQuery } from "@/hooks/use-media-query";

export default function DashCredentials(params: { projectID: string }) {
  const isDesktop = useMediaQuery("(min-width: 1281px)");

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
        <div className="flex w-full gap-4 p-2 *:h-10">
          <Skeleton className="w-8/12" />
          <Skeleton className="delay-250 w-4/12" />
        </div>
        <div className="flex w-full gap-4 p-2 *:h-10">
          <Skeleton className="w-5/12 delay-500" />
          <Skeleton className="delay-750 w-7/12" />
        </div>
      </div>
    );
  }

  if (data?.length) {
    return (
      <div className="flex h-60 flex-col gap-2 overflow-y-scroll pr-1">
        {data?.map((credential) => (
          <div key={credential.id} className="w-full">
            <Card className="p-0 shadow-none">
              <CardContent className="flex flex-row flex-wrap items-center justify-start gap-0 rounded-lg px-2 py-2 xl:flex-nowrap xl:justify-between xl:py-1 2xl:px-4">
                <div className="w-1/12 xl:w-1/12">
                  {credential.service == "Website" ? (
                    <Globe2 size={isDesktop ? "1.4em" : "1.2em"} />
                  ) : credential.service == "Hosting" ? (
                    <BetweenHorizontalStart
                      size={isDesktop ? "1.4em" : "1.2em"}
                    />
                  ) : credential.service == "Domaine registrar" ? (
                    <Link2 size={isDesktop ? "1.4em" : "1.2em"} />
                  ) : (
                    <KeyRound size={isDesktop ? "1.4em" : "1.2em"} />
                  )}
                </div>
                <div
                  data-clipboard-text={credential.username}
                  className="btn usename w-11/12 cursor-copy select-all truncate text-sm xl:w-4/12 2xl:text-base"
                >
                  {credential.username}
                </div>
                <div className="relative w-8/12 overflow-hidden text-nowrap xl:w-5/12">
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-r from-transparent to-white"></div>
                  <Link
                    href={credential.adminUrl}
                    target="_blank"
                    className="text-sm 2xl:text-base"
                  >
                    {credential.adminUrl}
                  </Link>
                </div>
                <div className="flex w-4/12 items-center justify-end xl:w-2/12">
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
                      <div className="w-full p-2 text-xs md:text-sm">
                        <div className="mb-1">
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="h-6 w-6 md:h-8 md:w-8">
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
                              <TooltipContent className="border shadow-none">
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
    <div className="flex h-60 w-full flex-col items-center justify-center gap-2">
      <p>No credentials</p>
    </div>
  );
}
