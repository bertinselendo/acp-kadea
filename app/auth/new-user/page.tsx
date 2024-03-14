import { LoginForm } from "@/components/auth/LoginForm";
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
import NewUserForm from "./newUserForm";

export default async function NewUserPage(props: PageParams<{}>) {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-screen justify-center align-middle items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <NewUserForm />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
