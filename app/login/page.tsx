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
import { getError } from "../auth/error/auth-error-mapping";

export default async function LoginPage(props: PageParams<{}>) {
  const { errorMessage, error } = getError(props.searchParams.error);

  const user = await auth();

  if (user) {
    redirect("/account");
  }

  return (
    <div className="flex flex-col h-screen justify-center align-middle items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>LogIn</CardTitle>
          <CardDescription>for more !!</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter>
          {error ? (
            <div>
              <h2>{error}</h2>
              <p>{errorMessage}</p>
            </div>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
