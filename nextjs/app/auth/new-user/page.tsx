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
import { bgGradient } from "@/lib/utils";

export default async function NewUserPage(props: PageParams<{}>) {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className={`h-screen w-screen ${bgGradient().gradient}`}>
      <div
        className={`flex justify-center items-center transition-all h-screen w-screen,
        ${bgGradient().noise}`}
      >
        <div className="flex flex-col gap-4 w-full p-6 md:w-[400px] md:p-0">
          <Card className="w-full bg-background/80">
            <CardContent className="p-6">
              <NewUserForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
