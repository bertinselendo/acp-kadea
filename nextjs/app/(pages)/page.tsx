import { Button } from "@/components/ui/button";
import Testimonials from "@/components/pages/testimonials";
import Faqs from "@/components/pages/faqs";
import { bgGradient } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import PricingTable from "@/components/pricing/pricing-table";

export default async function Home() {
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

      {/* features 1 */}
      <div
        id="features"
        className="features space-y-6 py-10 text-center md:py-20"
      >
        <div className="mx-auto w-10/12 text-center md:w-7/12">
          <h2 className="text-2xl font-extrabold md:text-4xl">
            A feedback system that doesn&apos;t just address needs — it
            intuitively anticipates them.
          </h2>
          <p className="mx-10 md:mx-32">
            Clean, streamlined, and tailored to your workflow, our feedback
            management tools shape themselves around how you work.
          </p>
        </div>
        <div className="mx-auto flex aspect-video w-10/12 items-center justify-center rounded-lg border shadow-lg md:w-7/12">
          video explicit
        </div>
      </div>

      {/* features 2 */}
      <div className="features space-y-6 py-10 text-center md:py-20">
        <div className="mx-auto w-10/12 text-center md:w-7/12">
          <h2 className="text-2xl font-extrabold md:text-4xl">
            Space for all your documents. Effortlessly organize and edit
            everything
          </h2>
          <p className="mx-10 md:mx-32">
            Reports, projects, and more - with our powerful, integrated document
            editor.
          </p>
        </div>
        <div className="mx-auto flex aspect-video w-10/12 items-center justify-center rounded-lg border shadow-lg md:w-7/12">
          video explicit
        </div>
      </div>

      {/* Testimonials */}
      <div
        id="testimonials"
        className="mx-auto flex w-8/12 flex-col items-center justify-center gap-4 pt-10 md:pt-20"
      >
        <Button className="bg-primary">Testimonials</Button>
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-black md:text-7xl">
            Our customers love
          </h2>
          <p>More powerful tools to help you create and grow.</p>
          <div className="w-screen px-2 md:px-10">
            <Testimonials />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div
        id="pricing"
        className="mx-auto flex w-8/12 flex-col items-center justify-center gap-4 pt-10 md:pt-20"
      >
        <Button className="bg-primary">Pricing</Button>
        <div className="space-y-4 text-center">
          <h2 className="text-5xl font-black md:text-7xl">
            A transparent pricing
          </h2>
          <p>No hidden fees. Cancel anytime.</p>
          <div className="w-screen px-10">
            <PricingTable />
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto flex w-11/12 flex-col items-center justify-center gap-4 pt-20 md:w-8/12">
        <Button className="bg-primary">FAQ</Button>
        <div className="w-full space-y-4 pb-20 text-center">
          <h2 className="text-5xl font-black md:text-7xl">
            Frequently Asked Questions
          </h2>

          <div className="text-left">
            <Faqs />
          </div>
        </div>
      </div>
    </>
  );
}
