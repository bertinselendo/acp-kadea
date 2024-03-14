import { ReactNode } from "react";
import { getUserData } from "../my-action.action";
import { userAuth } from "@/lib/auth/auth-utils";

export default async function UserProfileData() {
  const user = await userAuth();
  console.log(user);

  const userEmail = user?.email;

  if (!userEmail) {
    return;
  }

  const infos = await getUserData(userEmail);
  if (!infos) {
    return;
  }

  return (
    <div>
      {Object.entries(infos).map(([key, value]: any) => (
        <li key={key}>
          <strong>{key}:</strong>{" "}
          {key === "emailVerified" ? new Date(value).toLocaleString() : value}
        </li>
      ))}
    </div>
  );
}
