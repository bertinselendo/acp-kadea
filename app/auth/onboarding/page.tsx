"use client";

import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import Onboarding from "./onboarding";

export default function OnboardingPage() {
  return (
    <main className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-screen w-screen">
      <div className="flex justify-center items-center transition-all bg-blend-overlay bg-noise bg-white/80 h-screen w-screen">
        <Suspense fallback={<Loader />}>
          <Onboarding />
        </Suspense>
      </div>
    </main>
  );
}
