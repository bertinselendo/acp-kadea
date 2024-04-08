"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { TeamListSingleMember } from "./listSingleMember";
import { getTeamMembers } from "./members.action";
import TeamSearchForm from "./teamSearchForm";

export type ListMembersProps = [
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

export default function TeamListMembers() {
  const [members, setMembers] = useState<ListMembersProps | null>(null);
  const [filteredMembers, setFilteredMembers] =
    useState<ListMembersProps | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const members = await getTeamMembers();
      if (members) {
        setMembers(members as any);
        setFilteredMembers(members as any);
      }
    };
    fetchData();
  }, []);

  const handlerSearch = (event: any) => {
    let query = event.target.value;
    setSearch(query);

    const res = members?.filter(
      (obj: any) =>
        obj.firstName.toLowerCase().includes(query.toLowerCase()) ||
        obj.lastName.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredMembers(res as any);
  };

  if (!members) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full delay-250" />
        <Skeleton className="h-32 w-full delay-500" />
      </div>
    );
  }

  return (
    <div>
      <TeamSearchForm handlerSearch={handlerSearch} search={search} />
      <TeamListSingleMember members={filteredMembers} />
    </div>
  );
}
