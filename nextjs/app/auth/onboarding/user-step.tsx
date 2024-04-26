"use client";

import { OnboardUserStepForm } from "./user-step-form";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

export default function UserStep({ user }: { user: User }) {
  if (user) {
    redirect("/auth/onboarding?step=organization");
  }

  return (
    <>
      <h2 className="h2">Setup your account</h2>
      <p className="text-sm mb-4">Create the admin account</p>
      <OnboardUserStepForm />
    </>
  );
}
