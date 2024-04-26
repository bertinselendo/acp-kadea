"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  DotButton,
  useDotButton,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";
import { clickAnimation } from "@/components/ui/click-animation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { parseDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjectDocuments } from "@/components/admin/documents/documents.action";
import {
  IoDocumentAttach,
  IoDocumentText,
  IoEllipsisVertical,
} from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditDocumentModal from "@/components/admin/documents/editDocumentModal";
import { usePathname } from "next/navigation";

export default function DashDocuments(params: { projectID: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);
  const pathname = usePathname();

  const { isPending, data } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      try {
        return await getProjectDocuments(params.projectID);
      } catch (error) {
        throw error;
      }
    },
  });

  if (isPending) {
    return (
      <div className="grid grid-flow-col grid-rows-2 gap-4 *:h-28">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (data?.length) {
    return (
      <div className="grid grid-flow-row grid-cols-1 gap-2 overflow-y-scroll pr-2 2xl:grid-cols-2">
        {data?.map((document) => (
          <div key={document.id} className="w-full">
            <Card className="border-none bg-secondary p-1 hover:bg-secondary/50">
              <Link
                href={
                  document.type == "external"
                    ? `${document.link}`
                    : `${pathname}/documents/editor?doc=${document.id}`
                }
                target="_blank"
                onClick={clickAnimation}
              >
                <CardContent className="relative flex flex-col gap-4 rounded-lg bg-white p-2">
                  {document.type == "internal" ? (
                    <IoDocumentText className="absolute left-[42%] right-[42%] h-20 w-[16%] text-primary" />
                  ) : (
                    <IoDocumentAttach className="absolute left-[42%] right-[42%] h-20 w-[16%] text-light-orange" />
                  )}

                  <div className="flex justify-between">
                    <Badge variant="outline" className="bg-white py-1">
                      {parseDate(document.createdAt)}
                    </Badge>
                    <Avatar className="h-6 w-6 md:h-6 md:w-6">
                      <AvatarImage src={document.user?.avatar as string} />
                      <AvatarFallback>
                        <UserDiceAvater email={document.user?.email} />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text flex h-12 w-2/3 items-end">
                    <h3 className="truncate text-lg font-semibold">
                      {document.title}
                    </h3>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-60 w-full flex-col items-center justify-center gap-2">
      <p>No documents</p>
    </div>
  );
}
