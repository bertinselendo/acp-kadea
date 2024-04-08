"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthVerifiyPage() {
  const params = useSearchParams();
  const email = params.get("login_hint");

  return (
    <main className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-screen w-screen">
      <div className="flex justify-center items-center transition-all bg-blend-overlay bg-noise bg-white/80 h-screen w-screen">
        <div className="flex flex-col gap-4 w-[400px]">
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 mb-4 bg-primary rounded-full shadow-lg"></div>
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-3xl">
                Check your email for a link
              </CardTitle>
              <CardDescription>
                {email
                  ? "We have sent a magic link to contact@bertinselendo.com. The link will expire shortly, so please click on it quickly.."
                  : "We have sent a magic link to your email address. The link will expire shortly, so please use it promptly."}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-4">
              <Link
                href="https://mail.google.com/mail/u/0/"
                target="_blank"
                className="flex gap-2 items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 256 193"
                >
                  <path
                    fill="#4285F4"
                    d="M58.182 192.05V93.14L27.507 65.077L0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z"
                  />
                  <path
                    fill="#34A853"
                    d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837l-27.026 25.798z"
                  />
                  <path
                    fill="#EA4335"
                    d="m58.182 93.14l-4.174-38.647l4.174-36.989L128 69.868l69.818-52.364l4.669 34.992l-4.669 40.644L128 145.504z"
                  />
                  <path
                    fill="#FBBC04"
                    d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z"
                  />
                  <path
                    fill="#C5221F"
                    d="m0 49.504l26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23z"
                  />
                </svg>
                <span>Open Gmail</span>
              </Link>
              <Link
                href="https://mail.google.com/mail/u/0/"
                target="_blank"
                className="flex gap-2 items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="#0072c6"
                    d="M19.484 7.937v5.477l1.916 1.205a.489.489 0 0 0 .21 0l8.238-5.554a1.174 1.174 0 0 0-.959-1.128Z"
                  />
                  <path
                    fill="#0072c6"
                    d="m19.484 15.457l1.747 1.2a.522.522 0 0 0 .543 0c-.3.181 8.073-5.378 8.073-5.378v10.066a1.408 1.408 0 0 1-1.49 1.555h-8.874zm-9.044-2.525a1.609 1.609 0 0 0-1.42.838a4.131 4.131 0 0 0-.526 2.218A4.05 4.05 0 0 0 9.02 18.2a1.6 1.6 0 0 0 2.771.022a4.014 4.014 0 0 0 .515-2.2a4.369 4.369 0 0 0-.5-2.281a1.536 1.536 0 0 0-1.366-.809"
                  />
                  <path
                    fill="#0072c6"
                    d="M2.153 5.155v21.427L18.453 30V2Zm10.908 14.336a3.231 3.231 0 0 1-2.7 1.361a3.19 3.19 0 0 1-2.64-1.318A5.459 5.459 0 0 1 6.706 16.1a5.868 5.868 0 0 1 1.036-3.616a3.267 3.267 0 0 1 2.744-1.384a3.116 3.116 0 0 1 2.61 1.321a5.639 5.639 0 0 1 1 3.484a5.763 5.763 0 0 1-1.035 3.586"
                  />
                </svg>
                <span>Open Gmail</span>
              </Link>
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
