import { Skeleton } from "@/components/ui/skeleton";
import type { LayoutParams } from "@/types/next";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function RouteLayout(props: { children: ReactNode }) {
  return <div className="h-full">{props.children}</div>;
}
