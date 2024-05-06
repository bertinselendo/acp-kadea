"use client";

import { Button } from "@/components/ui/button";
import WebsiteLogo from "@/components/website/website-logo";
import { bgGradient, cn } from "@/lib/utils";
import Link from "next/link";
import { pagesMenus } from "../header/headerPages";
import Image from "next/image";

export type HeaderPagesProps = {};

export default function FooterPages(props: HeaderPagesProps) {
  return (
    <div className="mx-auto w-full space-y-6 bg-foreground py-2 pt-10 text-background">
      <div
        className={cn(
          `${bgGradient().gradient}`,
          "mx-auto w-10/12 overflow-hidden rounded-lg md:w-8/12",
        )}
      >
        <div
          className={`w-full justify-center transition-all
        ${bgGradient().noise}`}
        >
          <div className="space-y-4 p-8 text-center text-foreground md:p-20">
            <h1 className="text-2xl font-black md:text-5xl">
              Optimize your customer management with our all-in-one solution!
            </h1>
            <p>
              Simplify the relationship with your customers thanks to our
              powerful tools
            </p>
            <Button asChild>
              <Link href="/onboarding" className="text-base font-semibold">
                Try for free
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-10/12 gap-8 overflow-hidden rounded-lg max-sm:flex-col md:w-8/12 md:gap-2">
        <div className="w-6/12 space-y-4">
          <div className="flex w-full items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary shadow-lg"></div>
            <span className="text-lg font-bold">acp</span>
          </div>
          <div className="flex gap-3">
            <Link href="">
              <Image
                src="/socials/linkedin.svg"
                alt=""
                width="20"
                height={20}
                className="h-6 w-auto"
              />
            </Link>
            <Link href="">
              <Image
                src="/socials/twitter.svg"
                alt=""
                width="20"
                height={20}
                className="h-6 w-auto"
              />
            </Link>
            <Link href="">
              <Image
                src="/socials/instagram.svg"
                alt=""
                width="20"
                height={20}
                className="h-6 w-auto"
              />
            </Link>
          </div>
        </div>
        <div className="w-3/12 space-y-2">
          <h6>Menu</h6>
          <ul className="space-y-2 *:text-neutral-400">
            {pagesMenus.map((menu, index) => (
              <li key={index}>
                <Link href={menu.href}>{menu.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/12 space-y-2">
          <h6>Informations</h6>
          <ul className="space-y-2 *:text-neutral-400">
            <li>
              <Link href="#">Privacy Policy</Link>
            </li>
            <li>
              <Link href="#">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex w-10/12 justify-between gap-4 py-2 *:text-sm *:text-neutral-400 max-sm:flex-col-reverse md:w-8/12">
        <div>
          © SiteReview. 2024 Developed by <Link href="#">@BertinSelendo</Link>
        </div>{" "}
        <div>Contact</div>
      </div>
    </div>
  );
}
