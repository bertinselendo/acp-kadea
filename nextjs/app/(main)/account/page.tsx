import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth/helper";
import type { PageParams } from "@/types/next";
import AccountUserForm from "./accountUserForm";
import { Metadata } from "next";
import AccountTabs from "./accountTabs";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountUserPage(props: PageParams<{}>) {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 align-middle sm:px-0">
      <div className="my-4 w-full text-left sm:w-[400px]">
        <h2 className="text-2xl font-bold">Edit page</h2>
      </div>
      <AccountTabs />
    </div>
  );
}
