"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { dicebearAvatar } from "@/lib/auth/auth-utils";

export type UserAvatarProps = {
  src: string | null;
  size?: string;
  className?: string;
};

export default function UserAvatar(props: UserAvatarProps) {
  const { data, status } = useSession();
  const userEmail = data?.user?.email;
  const size = props.size ? props.size : 100;

  return (
    <>
      <Avatar className={props.className}>
        {props.src ? (
          <AvatarImage src={props.src} />
        ) : status == "authenticated" ? (
          <Image
            src={dicebearAvatar(userEmail)}
            alt={userEmail as string}
            width={size as number}
            height={size as number}
          />
        ) : (
          ""
        )}
        <AvatarFallback></AvatarFallback>
      </Avatar>
    </>
  );
}
