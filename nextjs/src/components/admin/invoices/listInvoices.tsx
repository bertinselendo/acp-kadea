"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectInvoices } from "./invoices.action";
import ListInvoicesLoop from "./listInvoicesLoop";
import { Card, CardContent } from "@/components/ui/card";
import AddInvoiceModal from "./addInvoicesModal";

export default function ListInvoices(params: { projectID: string }) {
  const [invoices, setInvoices] = useState<any>(null);

  useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const invoices = await getProjectInvoices(params.projectID);
      if (invoices) {
        setInvoices(invoices);
        return invoices;
      }
    },
  });

  return (
    <div>
      <ul className="grid grid-cols-2 grid-flow-row gap-4 flex-wrap pt-4 mt-4 border-t mb-[40vh]">
        <ListInvoicesLoop invoices={invoices} />

        <li className="">
          <Card className="p-1 h-[100%] min-h-40 w-full aspect-[3/4]">
            <CardContent className="rounded-lg p-4 flex flex-col gap-4 text-center items-center h-[100%] justify-center">
              <AddInvoiceModal projectID={params.projectID} />
            </CardContent>
          </Card>
        </li>
      </ul>
    </div>
  );
}
