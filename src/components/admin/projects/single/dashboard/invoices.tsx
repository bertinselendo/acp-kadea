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
    console.log(docRef.current?.clientWidth);
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
    <IoDocumentText className="w-20 h-20 text-primary bg-transparent" />
  );

  if (isPending) {
    return (
      <div className="grid grid-rows-1 grid-flow-col gap-2 *:aspect-[3/4]">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (data?.length) {
    return (
      <Carousel className="w-full h-60 flex flex-col gap-0 justify-between">
        <CarouselContent className="rounded-lg m-0 w-full h-full">
          {data.map((invoice: any, index: any) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-0">
              <Card
                className="p-1 mx-1 bg-secondary shadow-none aspect-[3/4] transition-all hover:bg-secondary/50 cursor-pointer"
                onClick={() => {
                  router.push(
                    pathname +
                      "/invoices/view?url=" +
                      encodeURIComponent(invoice.file)
                  );
                }}
              >
                <CardContent
                  ref={docRef}
                  className="w-full h-full overflow-hidden p-0 flex items-center justify-center relative rounded-lg flex-col gap-4 bg-background"
                >
                  <div className="flex justify-between absolute w-full top-0 p-2 z-10">
                    <Badge variant="outline" className="bg-white py-1">
                      {parseDate(invoice.createdAt)}
                    </Badge>
                  </div>
                  <div className="w-full h-40 flex items-end text absolute bottom-0 left-0 p-2 z-10 bg-gradient-to-t from-background to-transparent">
                    <h3 className="font-semibold truncate">
                      {invoice.reference}
                    </h3>
                  </div>
                  <Document
                    file={corsUrl(invoice.file)}
                    loading={docIcon}
                    error={docIcon}
                    noData={docIcon}
                    className="w-full h-full absolute top-0 flex justify-center items-center"
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
        <CarouselPrevious className="left-0 translate-y-0" />
        <CarouselNext className="right-0 translate-y-0" />
      </Carousel>
    );
  }

  return (
    <div className="flex flex-col gap-2 h-60 w-full items-center justify-center">
      <p>No invoices</p>
    </div>
  );
}
