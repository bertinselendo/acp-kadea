"use client";

import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import Onboarding from "./onboarding";
import { bgGradient } from "@/lib/utils";

export default function OnboardingPage() {
  return (
    <main className={`h-screen w-screen ${bgGradient().gradient}`}>
      <div
        className={`flex justify-center items-center transition-all h-screen w-screen,
        ${bgGradient().noise}`}
      >
        <Suspense fallback={<Loader />}>
          <Onboarding />
        </Suspense>
      </div>
    </main>
  );
}
