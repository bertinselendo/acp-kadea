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
import Link from "next/link";
import { bgGradient } from "@/lib/utils";
import WebsiteLogo from "@/components/website/website-logo";
import WebsiteFooter from "@/components/website/website-footer";

export default async function LoginPage(props: PageParams<{}>) {
  const { errorMessage, error } = getError(props.searchParams.error);

  const user = await auth();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className={`h-screen w-screen ${bgGradient().gradient}`}>
      <div
        className={`flex justify-center items-center transition-all h-screen w-screen,
        ${bgGradient().noise}`}
      >
        <div className="flex flex-col gap-4 w-full p-6 md:w-[400px] md:p-0">
          <div className="w-full flex justify-center">
            <WebsiteLogo />
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-3xl">Sign in to App</CardTitle>
              <CardDescription>
                We suggest using the email address you use at work.
              </CardDescription>
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
          <div className="w-full">
            <WebsiteFooter />
          </div>
        </div>
      </div>
    </main>
  );
}
