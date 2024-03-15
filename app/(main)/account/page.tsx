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

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountUserPage(props: PageParams<{}>) {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col justify-center align-middle items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <AccountUserForm />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
