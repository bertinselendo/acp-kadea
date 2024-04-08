"use client";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IoEllipseSharp } from "react-icons/io5";

export default function MainLogo() {
  return (
    <Link
      href="/"
      className={cn(navigationMenuTriggerStyle(), "h-14 w-14 p-0")}
    >
      <IoEllipseSharp size="2.2em" className="fill-primary" />
    </Link>
  );
}
