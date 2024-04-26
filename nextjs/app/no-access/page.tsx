"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, LogOut } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthVerifiyPage() {
  return (
    <main className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-screen w-screen">
      <div className="flex justify-center items-center transition-all bg-blend-overlay bg-noise bg-white/80 h-screen w-screen">
        <div className="flex flex-col gap-4 w-[400px]">
          <Card className="w-full bg-background/50 border-red-300">
            <CardHeader>
              <CardTitle className="text-3xl">You have no access</CardTitle>
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
            <div className="flex justify-center gap-4 transition-all *:text-sm *:opacity-75 *:hover:opacity-100">
              <Link href="/">Home</Link>
              <Link href="#">Privacy</Link>
              <Link href="#">Term</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
