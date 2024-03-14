"use client";

import { auth } from "@/lib/auth/helper";
import { useMutation } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function LogoutPage() {
  const user = useSession();

  if (!user.data?.user) {
    redirect("/login");
  }

  const { status, mutateAsync } = useMutation({
    mutationFn: () => signOut(),
  });

  mutateAsync();

  status == "success" ? redirect("/") : "";
}
