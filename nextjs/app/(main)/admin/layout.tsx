import type { LayoutParams } from "@/types/next";
import { ReactNode } from "react";

export default async function RouteLayout(props: { children: ReactNode }) {
  return (
    <div className="page-admin mb-20 h-max md:mb-0 md:h-full">
      {props.children}
    </div>
  );
}
