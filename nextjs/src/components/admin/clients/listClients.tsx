"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getClients } from "./clients.action";
import { useEffect, useState } from "react";
import ListSingleClient from "./listSingleClient";
import ClientSearchForm from "./clientSearchForm";

export type ListClientsProps = [
  {
    id: string;
    createdAt: Date;
    companyEmail: string;
    phone: string;
    address: string;
    country: string;
    companyName: string;
    logo: string;
    categorie: string;
    size: string;
    website: string;
    internalNote: string;
    users: any;
  }
];

export default function ListClients() {
  const [clients, setClients] = useState<ListClientsProps | null>(null);
  const [filteredClients, setfilteredClients] =
    useState<ListClientsProps | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const client = await getClients();
      if (client) {
        setClients(client as any);
        setfilteredClients(client as any);
      }
    };
    fetchData();
  }, []);

  const handlerSearch = (event: any, type: string | null = null) => {
    let query = type ? event : event.target.value;
    let where = "companyName";

    if (!type) {
      setSearch(query);
      setFilter("");
    }

    if (type) {
      where = type;
      setFilter(query);
      setSearch("");
    }

    const res = clients?.filter((obj: any) =>
      obj[where].toLowerCase().includes(query.toLowerCase())
    );

    setfilteredClients(res as ListClientsProps | null);
  };

  if (!clients) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full delay-250" />
        <Skeleton className="h-32 w-full delay-500" />
      </div>
    );
  }

  if (!clients.length) {
    return (
      <div className="h-32 w-full text-sm flex flex-col items-center justify-center text-center p-8">
        <p className="text-2xl">😔</p>
        <p>Looks like our database is on a diet - zero clients detected!</p>
      </div>
    );
  }

  return (
    <div>
      <ClientSearchForm
        clients={clients}
        handlerSearch={handlerSearch}
        search={search}
        open={open}
        setOpen={setOpen}
        filter={filter}
        setFilter={setFilter}
      />
      <ListSingleClient clients={filteredClients} />
    </div>
  );
}
