import "@app/prosemirror.css";
import type { LayoutParams } from "@/types/next";
import { ReactNode } from "react";

export default async function RouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="w-full flex justify-center">{children}</div>;
}
