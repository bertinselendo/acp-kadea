// /* eslint-disable @typescript-eslint/consistent-type-definitions */
import { User } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & User;
  }
}
