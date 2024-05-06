import { LogOutButton } from "@/components/auth/logOutButton";
import { Spotlight } from "@/components/ui/Spotlight";
import { Button } from "@/components/ui/button";
import { dicebearAvatar } from "@/lib/auth/auth-utils";
import { auth } from "@/lib/auth/helper";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  const userGreeting = () => {
    return session?.firstName ?? session?.email;
  };

  return (
    <main className="p-4">
      <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Spotlight <br /> is the new trend.
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            Spotlight effect is a great way to draw attention to a specific part
            of the page. Here, we are drawing the attention towards the text
            section of the page. I don&apos;t know why but I&apos;m running out
            of copy.
          </p>
          {session ? (
            <div className="flex flex-col items-center mt-4">
              <div>
                <Image
                  src={dicebearAvatar(session?.email)}
                  alt=""
                  width="40"
                  height="40"
                  className="rounded-full"
                />
              </div>
              <h2 className="font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
                Hello {userGreeting()}
              </h2>
            </div>
          ) : (
            ""
          )}

          <div className="flex items-center justify-center pt-4">
            {session ? (
              <div className="flex items-center justify-center gap-4">
                <Button size="sm" asChild>
                  <Link href="/admin">Dashboard</Link>
                </Button>
                <LogOutButton />
              </div>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
