import express, { type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";

export const createClient = async (req: Request, res: Response) => {
  const values = req.body?.values;
  const user = res.locals.session?.user;

  if (!values) {
    return BadRequestError(res, "Missing values");
  }

  if (!user.organizationId) {
    return BadRequestError(res, "User not have a organization");
  }

  const data = {
    companyName: values.companyName,
    companyEmail: values.companyEmail,
    phone: values.companyPhone,
    address: values.companyAdress,
    country: values.companyCountry,
    logo: values.companyLogo,
    categorie: values.companyCategorie,
    size: values.companySize,
    website: values.companyWebsite,
    internalNote: values.internalNote,
    organizationId: user.organizationId,
  };

  try {
    const newClient = await prisma.client.create({
      data: data,
    });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({
      error: "Error create client",
      code: error?.code,
      meta: error?.meta,
    });
  }
};

export const createClientUser = async (req: Request, res: Response) => {
  const clientID = req.params.id;
  const values = req.body?.values;
  const user = res.locals.session?.user;

  if (!values || !clientID) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: values.contactEmail,
      },
    });

    if (!findUser) {
      const newUser = await prisma.user.create({
        data: {
          firstName: values.contactFistName,
          email: values.contactEmail,
          role: "CLIENT",
          clientId: clientID,
          organizationId: user.organizationId,
        },
      });

      res.status(201).json(newUser);
    }
    res.status(201).json(findUser);
  } catch (error) {
    if (error.meta?.target[0] == "email") {
      res.status(500).json({
        error: "User already exist",
        code: error?.code,
        meta: error?.meta,
      });
    } else {
      res.status(500).json({
        error: "Error in database",
        code: error?.code,
        meta: error?.meta,
      });
    }
  }
};

export const addClientUser = async (req: Request, res: Response) => {
  const clientID = req.params.id;
  const values = req.body?.values;
  const user = res.locals.session?.user;

  if (!values || !clientID) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });

    if (findUser) {
      if (findUser.role == "GUEST") {
        const user = await prisma.user.update({
          where: {
            id: findUser.id,
          },
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            role: "CLIENT",
            clientId: clientID,
          },
          include: {
            client: true,
          },
        });
        return user;
      }
    }

    const newUser = await prisma.user.create({
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: "CLIENT",
        clientId: clientID,
        organizationId: user.organizationId,
      },
      include: {
        client: true,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.meta?.target[0] == "email") {
      res.status(500).json({
        error: "User already exist",
        code: error?.code,
        meta: error?.meta,
      });
    } else {
      res.status(500).json({
        error: "Error in database",
        code: error?.code,
        meta: error?.meta,
      });
    }
  }
};
