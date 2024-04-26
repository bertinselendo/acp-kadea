"use client";

import Image from "next/image";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WelcomeStep({ user }: { user: User }) {
  return (
    <>
      <h2 className="h2">Welcome {user?.firstName ?? ""} !</h2>
      <p className="text-sm mb-4">
        You are now ready to explore all the exciting features of our platform.
        Please don&apos;t hesitate to contact us if you have any questions or
        need help getting started.
      </p>
      <div className="h-44 md:h-72"></div>
      <Button className="absolute bottom-12 left-6 z-20">
        <Link href="/admin">Go to Admin</Link>
      </Button>
      <div className="absolute -bottom-12 -left-6 -right-6 z-10">
        <Image
          src="/illustrations/svg-started.svg"
          alt="started"
          width={500}
          height={500}
          className="z-10"
        />
      </div>
    </>
  );
}
