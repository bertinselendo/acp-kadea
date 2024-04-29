import express, { NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";

export const createOrganization = async (req: Request, res: Response) => {
  const values = req.body?.values;
  const user = res.locals.session?.user;

  if (!values) {
    return BadRequestError(res, "Bad Request");
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

    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({
      error: "Error creating organization",
      code: error?.code,
      meta: error?.meta,
    });
  }
};
