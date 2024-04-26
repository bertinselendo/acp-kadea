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

export default async function LoginPage(props: PageParams<{}>) {
  const { errorMessage, error } = getError(props.searchParams.error);

  const user = await auth();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-screen w-screen">
      <div className="flex justify-center items-center transition-all bg-blend-overlay bg-noise bg-white/80 h-screen w-screen">
        <div className="flex flex-col gap-4 w-[400px]">
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 mb-4 bg-primary rounded-full shadow-lg"></div>
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
