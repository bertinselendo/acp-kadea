"use client";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IoEllipseSharp } from "react-icons/io5";

export default function MainLogo() {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  return (
    <div>
      <Link
        href="/"
        className={cn(
          navigationMenuTriggerStyle(),
          "h-10 w-10 p-0 md:h-14 md:w-14",
        )}
      >
        <IoEllipseSharp
          size={isSmallDevice ? "1.8em" : "2.2em"}
          className="fill-primary"
        />
      </Link>
    </div>
  );
}
