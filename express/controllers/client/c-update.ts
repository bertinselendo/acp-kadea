import express, { type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";

export const updateClient = async (req: Request, res: Response) => {
  const clientID = req.params.id;
  const values = req.body?.values;

  if (!values) {
    return BadRequestError(res, "Missing values");
  }

  if (!clientID) {
    return BadRequestError(res, "Error: Missing client id");
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
  };

  try {
    const updatedClient = await prisma.client.update({
      where: {
        id: clientID,
      },
      data: data,
    });
    res.status(201).json(updatedClient);
  } catch (error) {
    res.status(500).json({
      error: "Error create client",
      code: error?.code,
      meta: error?.meta,
    });
  }
};
