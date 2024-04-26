import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { PageParams } from "@/types/next";
import Link from "next/link";
import { getError } from "./auth-error-mapping";
import { LogIn } from "lucide-react";
import { bgGradient } from "@/lib/utils";
import WebsiteFooter from "@/components/website/website-footer";

export default async function AuthErrorPage(props: PageParams<{}>) {
  const { errorMessage, error } = getError(props.searchParams.error);

  return (
    <main className={`h-screen w-screen ${bgGradient().gradient}`}>
      <div
        className={`flex justify-center items-center transition-all h-screen w-screen,
        ${bgGradient().noise}`}
      >
        <div className="flex flex-col gap-4 w-full p-6 md:w-[400px] md:p-0">
          <Card className="w-full bg-background/50 border-red-300">
            <CardHeader>
              <CardDescription>{error}</CardDescription>
              <CardTitle>{errorMessage}</CardTitle>
            </CardHeader>
            <CardFooter className="flex gap-4 justify-between">
              <Button className="rounded-lg" asChild>
                <Link href="/login" className="flex gap-2 items-center">
                  <LogIn className="w-5 h-5" /> Try again
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <div className="w-full">
            <WebsiteFooter />
          </div>
        </div>
      </div>
    </main>
  );
}
