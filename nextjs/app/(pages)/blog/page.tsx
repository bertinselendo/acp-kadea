import { Button } from "@/components/ui/button";
import { bgGradient } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function BlogPage() {
  return (
    <>
      {/* hero */}
      <div className={`${bgGradient().gradient} -mt-14`}>
        <div
          className={`w-full justify-center transition-all
        ${bgGradient().noise}`}
        >
          <div className="mx-auto flex w-10/12 flex-col items-center justify-center gap-4 pt-20 md:w-8/12 md:pt-32">
            <Button className="bg-primary/30 text-xs">
              by agency for agencies
            </Button>
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-black md:text-7xl">
                Manage your customers resources simply and centrally
              </h1>
              <p>
                From feedback to documents, including invoices and access to
                project accounts.
              </p>
              <Button asChild>
                <Link href="/onboarding" className="text-base font-semibold">
                  Try for free
                </Link>
              </Button>
              <div className="mx-auto flex items-center justify-center gap-1">
                <Image
                  src="/pages/stars.png"
                  alt=""
                  width="136"
                  height="28"
                  className="h-6 w-auto"
                />
                <span>4.9 out of 5</span>
              </div>
              <div>
                <Image
                  src="/pages/client-portal-mockup.png"
                  alt=""
                  width="1920"
                  height="1080"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
