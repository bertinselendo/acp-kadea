"use client";

import { dicebearAvatar } from "@/lib/auth/auth-utils";
import { AvatarFallback } from "../ui/avatar";
import Image from "next/image";

export const UserDiceAvater = ({ email }: any) => {
  const dice = dicebearAvatar(email);

  return (
    <Image
      src={dice}
      width="80"
      height="80"
      alt={email ? email : ""}
      className="w-full h-full"
    />
  );
};
