import { User } from "@prisma/client";

export const dicebearAvatar = (email: string | null | undefined) => {
  const avatar = `https://api.dicebear.com/7.x/thumbs/png?seed=${email}`;
  return avatar;
};

export const isTeamMember = (user: User | undefined | null) => {
  if (
    user?.role == "ADMIN" ||
    user?.role == "MANAGER" ||
    user?.role == "WORKER"
  ) {
    return true;
  }

  return false;
};

export const isTeamManager = (user: User | undefined | null) => {
  if (user?.role == "ADMIN" || user?.role == "MANAGER") {
    return true;
  }

  return false;
};

export const isAdmin = (user: User | undefined | null) => {
  if (user?.role == "ADMIN") {
    return true;
  }

  return false;
};

export const isWorker = (user: User | undefined | null) => {
  if (user?.role == "WORKER") {
    return true;
  }

  return false;
};

export const isClient = (user: User | undefined | null) => {
  if (user?.role == "CLIENT") {
    return true;
  }

  return false;
};
