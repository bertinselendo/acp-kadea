"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { User, Organization } from "@prisma/client";

// CREATE

type userOnboardTyepe = {
  email: string;
  firstName: string;
  lastName: string;
};
export async function createOnboardUser(values: userOnboardTyepe) {
  try {
    const user = await prisma.user.create({
      data: {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        role: "ADMIN",
      },
    });
    return user;
  } catch (error) {
    throw new Error("Error creating user databse");
  }
}

export async function createOnboardOrganization(values: Organization) {
  const user = await auth();

  if (!user) {
    return;
  }

  const data = {
    email: values.email,
    name: values.name,
    phone: values.phone,
    address: values.address,
    city: values.city,
    country: values.country,
    logo: values.logo,
    cover: values.cover,
    website: values.website,
  };

  try {
    const organization = await prisma.organization.create({
      data: data,
    });

    if (organization) {
      const team = prisma.teamMember.create({
        data: {
          type: "Internal",
          userId: user.id,
        },
      });

      const userRes = prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          organizationId: organization.id,
        },
      });

      const transaction = await prisma.$transaction([team, userRes]);

      if (transaction) return organization;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error unknown");
  }
}

// READ

export async function isOrganizationExist(values: Organization) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: {
        email: values.email,
      },
    });
    if (!organization) {
      return false;
    }
    return true;
  } catch (error) {
    throw new Error("Error databse");
  }
}

// UPDATE

export async function updateOnboardUser(values: User) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const updateRes = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: values.avatar,
        firstName: values.firstName,
        lastName: values.lastName,
      },
    });
    return updateRes;
  } catch (error) {
    throw new Error("Error databse");
  }
}
