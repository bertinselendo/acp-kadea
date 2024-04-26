"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WebsiteFooter from "@/components/website/website-footer";
import { bgGradient } from "@/lib/utils";
import { Home, LogOut } from "lucide-react";
import Link from "next/link";

export default function AuthVerifiyPage() {
  return (
    <main className={`h-screen w-screen ${bgGradient().gradient}`}>
      <div
        className={`flex justify-center items-center transition-all h-screen w-screen,
        ${bgGradient().noise}`}
      >
        <div className="flex flex-col gap-4 w-full p-6 md:w-[400px] md:p-0">
          <Card className="w-full bg-background/50 border-red-300">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">
                You have no access
              </CardTitle>
              <CardDescription>
                We&apos;re sorry, but you do not have access to any resources on
                this website. Please check your permissions or contact the site
                administrator for more information.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-4 justify-between">
              <Button className="rounded-lg" asChild>
                <Link href="/" className="flex gap-2 items-center">
                  <Home className="w-5 h-5" /> Go to home
                </Link>
              </Button>
              <Button className="rounded-lg" variant="destructive" asChild>
                <Link href="/logout" className="flex gap-2 items-center">
                  <LogOut className="w-5 h-5" /> Sign out
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
