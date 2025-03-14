"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import UserStep from "./user-step";
import VerifyStep from "./verify-step";
import OrganizationStep from "./organization-step";
import SubscriptionStep from "./subscription-step";
import { cn } from "@/lib/utils";
import WelcomeStep from "./welcome-step";
import { useSession } from "next-auth/react";
import { Loader } from "@/components/ui/loader";

export default function Onboarding() {
  const searchParams = useSearchParams();
  const search = searchParams.get("step");
  const step = search ?? "user";

  const { status, data } = useSession();
  const user = data?.user;

  return (
    <div
      className={cn(
        step === "subscription" ? "w-[700px]" : "w-[500px]",
        "flex flex-col gap-4 p-6 md:p-0"
      )}
    >
      <Tabs defaultValue={step}>
        <TabsList className="w-full hidden grid-rows-1 grid-flow-col bg-transparent *:py-2 *:pointer-events-none">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
        </TabsList>
        <TabsList className="w-full grid grid-rows-1 grid-flow-col bg-transparent gap-2 *:w-3 *:h-3 *:p-0 data-[state=active]:*:px-3 data-[state=active]:*:bg-gray-400 *:bg-white *:pointer-events-none">
          <TabsTrigger value="user"></TabsTrigger>
          <TabsTrigger value="organization"></TabsTrigger>
          <TabsTrigger value="subscription"></TabsTrigger>
          <TabsTrigger value="welcome"></TabsTrigger>
        </TabsList>
        <Card className="w-full bg-background/50 p-6 mt-2 overflow-hidden">
          {status == "loading" ? (
            <div className="w-full h-80 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <>
              <TabsContent value="user">
                <UserStep user={user} />
              </TabsContent>
              <TabsContent value="verify" className="text-center">
                <VerifyStep />
              </TabsContent>
              <TabsContent value="organization">
                <OrganizationStep user={user} />
              </TabsContent>
              <TabsContent value="subscription">
                <SubscriptionStep user={user} />
              </TabsContent>
              <TabsContent value="welcome" className="relative">
                <WelcomeStep user={user} />
              </TabsContent>
            </>
          )}
        </Card>
      </Tabs>

      <div className="w-full">
        <div className="flex justify-center gap-4 transition-all *:text-sm *:opacity-75 *:hover:opacity-100">
          <Link href="/">Home</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Term</Link>
        </div>
      </div>
    </div>
  );
}
