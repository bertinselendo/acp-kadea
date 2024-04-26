"use client";

import { clickAnimation } from "@/components/ui/click-animation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { corsUrl, parseDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Invoice, User } from "@prisma/client";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IoDocumentText,
  IoEllipsisHorizontal,
  IoEllipsisVertical,
} from "react-icons/io5";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import EditInvoiceModal from "./editInvoicesModal";
import { DeleteInvoiceAlert } from "./deleteInvoicesAlert";
import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export type ListInvoicesLoopProps = {
  invoices: [
    Invoice & {
      user: User;
    },
  ];
};

export default function ListInvoicesLoop(props: ListInvoicesLoopProps) {
  const invoices = props.invoices;
  const pathname = usePathname();

  const [pageWidth, setPageWidth] = useState();
  const docRef = useRef<any>();

  function onPageLoadSuccess() {
    setPageWidth(docRef.current?.clientWidth);
  }

  const { data } = useSession();
  const user = data?.user as User;
  const currentRole = user?.role;

  if (!invoices) {
    return (
      <li className="flex animate-pulse flex-col gap-4 rounded-lg border bg-transparent p-4">
        <Skeleton className="delay-250 h-40 w-full" />
        <div className="flex gap-10">
          <Skeleton className="h-10 w-2/3 delay-500" />
          <Skeleton className="delay-750 h-10 w-1/3" />
        </div>
      </li>
    );
  }

  if (!invoices.length) {
    return (
      <li className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-transparent p-8 text-center text-sm">
        <p className="text-2xl">😔</p>
        <p>Looks like a client is on a diet - zero invoices detected!</p>
      </li>
    );
  }

  const docIcon = (
    <IoDocumentText className="h-20 w-20 bg-transparent text-primary" />
  );

  return (
    <>
      {invoices?.map((invoice) => (
        <li key={invoice.id} className="">
          <Card className="bg-secondary p-1">
            <CardContent
              ref={docRef}
              className="relative flex aspect-[3/4] flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-background p-0"
            >
              <div className="absolute top-0 z-10 flex w-full justify-between p-2 md:p-4">
                <Badge variant="outline" className="bg-white py-1">
                  {parseDate(invoice.createdAt)}
                </Badge>
                {(currentRole == "ADMIN" ||
                  currentRole == "MANAGER" ||
                  invoice.createdBy === user.id) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:hidden">
                      <IoEllipsisVertical onClick={clickAnimation} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <EditInvoiceModal invoice={invoice} />
                      <DropdownMenuSeparator />
                      <DeleteInvoiceAlert invoice={invoice} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="text absolute bottom-0 left-0 z-10 flex h-40 w-full items-end bg-gradient-to-t from-background to-transparent p-4">
                <h3 className="truncate text-sm font-semibold md:text-xl">
                  {invoice.reference}
                </h3>
              </div>
              <Document
                file={corsUrl(invoice.file)}
                loading={docIcon}
                error={docIcon}
                noData={docIcon}
              >
                <Page
                  className="max-w-8"
                  key={1}
                  pageNumber={1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  onLoadSuccess={onPageLoadSuccess}
                  width={pageWidth}
                  loading={docIcon}
                  error={docIcon}
                  noData={docIcon}
                />
              </Document>
            </CardContent>
            <CardFooter className="mb-2 mt-4 flex items-center justify-between gap-4 p-0 px-1 md:px-2">
              <div>
                <Avatar className="h-8 w-8 md:h-8 md:w-8">
                  <AvatarImage src={invoice.user?.avatar as string} />
                  <AvatarFallback>
                    <UserDiceAvater email={invoice.user?.email} />
                  </AvatarFallback>
                </Avatar>
              </div>
              {invoice.file ? (
                <Link
                  href={`${pathname}/view?url=${encodeURIComponent(
                    invoice.file,
                  )}`}
                  onClick={clickAnimation}
                >
                  <Button className="rounded-full bg-black text-xs text-white transition hover:bg-gray-800 xl:text-sm">
                    Open
                  </Button>
                </Link>
              ) : invoice.link ? (
                <Link href={invoice.link} onClick={clickAnimation}>
                  <Button className="rounded-full bg-black text-white transition hover:bg-gray-800">
                    Open
                  </Button>
                </Link>
              ) : (
                ""
              )}
            </CardFooter>
          </Card>
        </li>
      ))}
    </>
  );
}
