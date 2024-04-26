"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseDate } from "@/lib/utils";
import { Client, Organization } from "@prisma/client";
import Image from "next/image";
import { Globe, Mail, Phone } from "lucide-react";

type OrgDashtHeaderType = { org: Organization & { clients: Client[] } };

export default function OrgDashtHeader({ org }: OrgDashtHeaderType) {
  return (
    <Card
      className="border-none h-72"
      style={{ background: `linear-gradient(${org?.cover}, #fff)` }}
    >
      <CardContent className="flex flex-col justify-between h-full gap-8 p-4">
        <div className="w-full flex justify-between">
          <Badge variant="outline" className="bg-white py-1">
            {parseDate(org?.createdAt)}
          </Badge>
          <Badge variant="outline" className="bg-white py-1">
            {org.clients.length}{" "}
            {org.clients.length < 2 ? "team member" : "team members"}
          </Badge>
        </div>
        <div className="flex gap-4 items-end justify-between">
          <div className="w-3/5">
            {org.logo && (
              <Image
                src={org.logo}
                alt=""
                width={80}
                height={80}
                className="aspect-square rounded-full bg-secondary w-20 h-20 mb-2"
              />
            )}
            <h3 className="font-semibold text-2xl">{org?.name}</h3>
            <div className="*:flex *:gap-1 *:items-center *:text-sm">
              <p>
                <Mail className="w-3 h-3" /> {org?.email}
              </p>
              <p>
                <Phone className="w-3 h-3" /> {org?.phone}
              </p>
              <p>
                <Globe className="w-3 h-3" /> {org?.website}
              </p>
            </div>
          </div>
          <div className="w-2/5 flex gap-2 flex-wrap items-center justify-end">
            <Badge variant="outline" className="border-black py-1 h-fit">
              {org?.address}
            </Badge>
            <Badge variant="outline" className="border-black py-1 h-fit">
              {org?.city}
            </Badge>
            <Badge variant="outline" className="border-black py-1 h-fit">
              {org?.country}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
