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
    }
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
      <li className="animate-pulse border bg-transparent rounded-lg p-4 flex flex-col gap-4">
        <Skeleton className="h-40 w-full delay-250" />
        <div className="flex gap-10">
          <Skeleton className="h-10 w-2/3 delay-500" />
          <Skeleton className="h-10 w-1/3 delay-750" />
        </div>
      </li>
    );
  }

  if (!invoices.length) {
    return (
      <li className="border bg-transparent rounded-lg flex flex-col gap-4 text-sm items-center justify-center text-center p-8">
        <p className="text-2xl">😔</p>
        <p>Looks like a client is on a diet - zero invoices detected!</p>
      </li>
    );
  }

  const docIcon = (
    <IoDocumentText className="w-20 h-20 text-primary bg-transparent" />
  );

  return (
    <>
      {invoices?.map((invoice) => (
        <li key={invoice.id} className="">
          <Card className="p-1 bg-secondary">
            <CardContent
              ref={docRef}
              className="aspect-[3/4] p-0 overflow-hidden flex items-center justify-center relative rounded-lg flex-col gap-4 bg-background"
            >
              <div className="flex justify-between absolute w-full top-0 p-4 z-10">
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
              <div className="w-full h-40 flex items-end text absolute bottom-0 left-0 p-4 z-10 bg-gradient-to-t from-background to-transparent">
                <h3 className="font-semibold text-xl truncate">
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
            <CardFooter className="flex gap-4 justify-between mt-4 mb-2 p-0 px-2 items-center">
              <div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={invoice.user?.avatar as string} />
                  <AvatarFallback>
                    <UserDiceAvater email={invoice.user?.email} />
                  </AvatarFallback>
                </Avatar>
              </div>
              {invoice.file ? (
                <Link
                  href={`${pathname}/view?url=${encodeURIComponent(
                    invoice.file
                  )}`}
                  onClick={clickAnimation}
                >
                  <Button className="bg-black text-white rounded-full transition hover:bg-gray-800">
                    Open
                  </Button>
                </Link>
              ) : invoice.link ? (
                <Link href={invoice.link} onClick={clickAnimation}>
                  <Button className="bg-black text-white rounded-full transition hover:bg-gray-800">
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
