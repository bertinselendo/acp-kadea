"use server";

// CREATE

// READ

export async function getAllOrgDatas() {
  try {
    // const user = prisma.user.findUnique({
    //   where: {
    //     id: userID,
    //   },
    //   include: {
    //     feedbacks: true,
    //     documents: true,
    //     credentials: true,
    //     invoices: true,
    //   },
    // });

    const feedbacks = await prisma.feedback.count();
    const documents = await prisma.document.count();
    const credentials = await prisma.credential.count();
    const invoices = await prisma.invoice.count();

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

export async function getAllOrgProjects() {
  try {
    const projects = await prisma.project.count();

    return projects;
  } catch (error) {
    throw error("Error getting all projects");
  }
}

// UPDATE

// DELETE
