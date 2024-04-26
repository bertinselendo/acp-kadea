"use server";

import { auth } from "@/lib/auth/helper";

// CREATE

// READ

export async function getAllOrgDatas(organizationId: string) {
  const user = await auth();

  if (!user) return;

  try {
    const order = {
      user: {
        organizationId: organizationId,
      },
    };

    const feedbacks = await prisma.feedback.count({
      where: order,
    });

    const documents = await prisma.document.count({
      where: order,
    });
    const credentials = await prisma.credential.count({
      where: order,
    });
    const invoices = await prisma.invoice.count({
      where: order,
    });

    const stats = {
      feedbacks: feedbacks,
      documents: documents,
      credentials: credentials,
      invoices: invoices,
    };

    return stats;
  } catch (error) {
    throw error("Error getting all datas");
  }
}

export async function getAllOrgProjects(organizationId) {
  try {
    const projects = await prisma.project.count({
      where: {
        client: {
          organizationId: organizationId,
        },
      },
    });
    return projects;
  } catch (error) {
    throw error("Error getting all projects");
  }
}

// UPDATE

// DELETE
