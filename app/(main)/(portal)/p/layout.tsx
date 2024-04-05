import ListClients from "@/components/admin/clients/listClients";
import ProjectNavMenu from "@/components/admin/projects/single/projectNavMenu";
import MessagePanel from "@/components/chat/messagePanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth/helper";
import type { LayoutParams } from "@/types/next";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RouteLayout(props: LayoutParams<{}>) {
  return props.children;
}
