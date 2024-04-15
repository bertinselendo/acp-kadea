"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { Invoice } from "@prisma/client";

// CREATE

export async function invoiceCreationAction(
  values: Invoice,
  projectID: string
) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        createdBy: user.id,
        reference: values.reference,
        dueDate: values.dueDate,
        file: values.file,
        link: values.link,
        projectId: projectID,
      },
      include: {
        project: true,
      },
    });
    return newInvoice;
  } catch (error) {
    console.log(error);
    throw new Error("Error while create invoice");
  }
}

// READ

export async function getProjectInvoices(projectID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        projectId: projectID,
      },
      include: {
        user: true,
      },
    });

    return invoices;
  } catch (error) {
    throw new Error("Error getting invoices");
  }
}

export async function getProjectInvoice(invoiceID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceID,
      },
      include: {
        user: true,
      },
    });

    return invoice;
  } catch (error) {
    throw new Error("Error getting invoice");
  }
}

export async function getAllInvoices() {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
    });

    return invoices;
  } catch (error) {
    throw new Error("Error getting invoices");
  }
}

// UPDATE

export async function invoiceUpdatetAction(values: Invoice, invoiceID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const invoice = await prisma.invoice.update({
      where: {
        id: invoiceID,
      },
      data: {
        reference: values.reference,
        dueDate: values.dueDate,
        file: values.file,
        link: values.link,
      },
    });
    return invoice;
  } catch (error) {
    console.log(error);
    throw new Error("Error while update invoice");
  }
}

// DELETE

export async function invoiceDeleteAction(invoiceID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const invoice = await prisma.invoice.delete({
      where: {
        id: invoiceID,
      },
    });
    return invoice;
  } catch (error) {
    console.log(error);
    throw new Error("Error while delete invoice");
  }
}
