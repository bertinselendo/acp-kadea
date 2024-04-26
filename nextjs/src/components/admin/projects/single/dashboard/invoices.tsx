"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

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
import { corsUrl, parseDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjectInvoices } from "@/components/admin/invoices/invoices.action";
import { Document, Page, pdfjs } from "react-pdf";
import { IoDocumentText } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function DashInvoices(params: { projectID: string }) {
  const [pageWidth, setPageWidth] = useState();
  const docRef = useRef<any>();
  const router = useRouter();
  const pathname = usePathname();

  function onPageLoadSuccess() {
    setPageWidth(docRef.current?.clientWidth);
  }

  const { isPending, data } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      try {
        return await getProjectInvoices(params.projectID);
      } catch (error) {
        throw error;
      }
    },
  });

  const docIcon = (
    <IoDocumentText className="h-20 w-20 bg-transparent text-primary" />
  );

  if (isPending) {
    return (
      <div className="grid grid-flow-col grid-rows-1 gap-2 *:aspect-[3/4]">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (data?.length) {
    return (
      <Carousel className="flex h-48 w-full flex-col justify-between gap-0 md:h-60">
        <CarouselContent className="m-0 h-full w-full rounded-lg">
          {data.map((invoice: any, index: any) => (
            <CarouselItem
              key={index}
              className="basis-1/2 p-0 md:basis-full xl:basis-1/2 2xl:basis-1/3"
            >
              <Card
                className="mx-1 aspect-[3/4] cursor-pointer bg-secondary p-1 shadow-none transition-all hover:bg-secondary/50"
                onClick={() => {
                  router.push(
                    pathname +
                      "/invoices/view?url=" +
                      encodeURIComponent(invoice.file),
                  );
                }}
              >
                <CardContent
                  ref={docRef}
                  className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-background p-0"
                >
                  <div className="absolute top-0 z-10 flex w-full justify-between p-2">
                    <Badge variant="outline" className="bg-white py-1">
                      {parseDate(invoice.createdAt)}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 z-10 flex h-40 w-full items-end bg-gradient-to-t from-background to-transparent p-2">
                    <h3 className="truncate text-sm font-semibold md:text-base">
                      {invoice.reference}
                    </h3>
                  </div>
                  <Document
                    file={corsUrl(invoice.file)}
                    loading={docIcon}
                    error={docIcon}
                    noData={docIcon}
                    className="absolute top-0 flex h-full w-full items-center justify-center"
                  >
                    <Page
                      key={1}
                      pageNumber={1}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      onLoadSuccess={onPageLoadSuccess}
                      width={pageWidth}
                      className="overflow-hidden"
                      loading={docIcon}
                      error={docIcon}
                      noData={docIcon}
                    />
                  </Document>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3 translate-y-0 md:-left-1" />
        <CarouselNext className="-right-3 translate-y-0 md:-right-1" />
      </Carousel>
    );
  }

  return (
    <div className="flex h-60 w-full flex-col items-center justify-center gap-2">
      <p>No invoices</p>
    </div>
  );
}
