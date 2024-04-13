"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { Document } from "@prisma/client";
import { Value } from "@radix-ui/react-select";

export async function documentCreationAction(
  values: Document,
  projectID: string
) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const newDocument = await prisma.document.create({
      data: {
        createdBy: user.id,
        type: values.type,
        title: values.title,
        content: values.content,
        link: values?.link,
        projectId: projectID,
      },
      include: {
        project: true,
      },
    });
    return newDocument;
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}

export async function getProjectDocuments(projectID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const documents = await prisma.document.findMany({
      where: {
        projectId: projectID,
      },
      include: {
        user: true,
      },
    });

    return documents;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function getProjectDocument(documentID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const document = await prisma.document.findUnique({
      where: {
        id: documentID,
      },
      include: {
        user: true,
      },
    });

    return document;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function documentUpdatetAction(
  values: Document,
  documentID: string
) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const document = await prisma.document.update({
      where: {
        id: documentID,
      },
      data: {
        title: values.title,
        link: values.link,
        content: values.content,
      },
    });
    return document;
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}

export async function documentTitleUpdatetAction(
  title: string,
  documentID?: string
) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const existingRecord = await prisma.document.findUnique({
      where: { id: documentID },
    });

    if (existingRecord) {
      const document = await prisma.document.update({
        where: {
          id: documentID,
        },
        data: {
          title: title,
        },
      });
      return document;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error Saving title");
  }
}

export async function documentDeleteAction(documentID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const document = await prisma.document.delete({
      where: {
        id: documentID,
      },
    });
    return document;
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}

export async function getProjectDocumentTitle(documentID: string) {
  try {
    const title = await prisma.document
      .findUnique({
        where: {
          id: documentID,
        },
      })
      .then((doc) => doc?.title);

    return title;
  } catch (error) {
    throw new Error("Error databse");
  }
}
