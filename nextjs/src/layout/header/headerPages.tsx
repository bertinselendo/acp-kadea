"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export type HeaderPagesProps = {};

export const pagesMenus = [
  {
    name: "Features",
    href: "/#features",
  },
  {
    name: "Testimonials",
    href: "/#testimonials",
  },
  {
    name: "Pricing",
    href: "/#pricing",
  },
  {
    name: "Blog",
    href: "/blog",
  },
];

export default function HeaderPages(props: HeaderPagesProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const session = useSession();
  const user = session?.data?.user;

  const loginLink = !user && (
    <Link href="/login" className="text-base font-semibold">
      Login
    </Link>
  );

  const tryLink = user ? (
    <Link href="/admin" className="text-base font-semibold">
      Dashboard
    </Link>
  ) : (
    <Link href="/auth/onboarding" className="text-base font-semibold">
      Try for free
    </Link>
  );

  if (isDesktop) {
    return (
      <div className="mx-auto flex w-11/12 items-center justify-between gap-4 py-2">
        <div className="flex w-2/12 items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary shadow-lg"></div>
          <span className="text-lg font-bold">acp</span>
        </div>
        <div className="w-8/12">
          <ul className="mx-auto flex w-max gap-6">
            {pagesMenus.map((menu, index: number) => (
              <li key={index}>
                <Link href={menu.href} className="text-base font-semibold">
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-2/12 items-center gap-2">
          {loginLink}
          <Button asChild>{tryLink}</Button>
        </div>
      </div>
    );
  } else if (isMobile) {
    return (
      <div className="mx-auto flex w-11/12 items-center justify-between gap-4 py-2">
        <div className="flex w-5/12 items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary shadow-lg"></div>
          <span className="text-lg font-bold">acp</span>
        </div>
        <div className="flex w-7/12 items-center justify-end gap-2">
          <Button asChild>{tryLink}</Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Menu size="1.8em" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-5 mt-2 w-40">
              {pagesMenus.map((menu, index: number) => (
                <DropdownMenuItem
                  asChild
                  key={index}
                  className="cursor-pointer"
                >
                  <Link href={menu.href} className="text-base font-semibold">
                    {menu.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                {loginLink}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mx-auto flex w-11/12 items-center justify-between gap-4 py-2">
        <div className="flex w-7/12 items-center gap-2 md:w-2/12">
          <Skeleton className="h-10 w-20 md:w-40" />
        </div>
        <div className="w-0/12 md:w-8/12">
          <Skeleton className="mx-auto h-10 w-6/12" />
        </div>
        <div className="flex w-5/12 items-center gap-2 md:w-2/12">
          <Skeleton className="h-10 w-full md:w-40" />
        </div>
      </div>
    );
  }
}
