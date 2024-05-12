import { Button } from "@/components/ui/button";
import { bgGradient } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default async function BlogPage() {
  return (
    <>
      {/* hero */}
      <div className={`${bgGradient().gradient} -mt-14`}>
        <div
          className={`w-full justify-center transition-all
        ${bgGradient().noise}`}
        >
          <div className="mx-auto flex w-10/12 flex-col items-center justify-center gap-4 pt-10 md:w-8/12">
            <div className="my-10 space-y-4 text-center md:my-16">
              <h1 className="text-4xl font-black md:text-7xl">Blog</h1>
            </div>
          </div>
        </div>
      </div>

      {/* On dev */}
      <div
        id="features"
        className="features space-y-6 py-10 text-center md:py-20"
      >
        <div className="mx-auto w-10/12 text-center md:w-7/12">
          <h2 className="text-2xl font-extrabold md:text-4xl">
            Page under construction
          </h2>
          <p className="mx-10 md:mx-32">
            We&apos;re working to bring you an optimal experience soon
          </p>
        </div>
      </div>
    </>
  );
}
