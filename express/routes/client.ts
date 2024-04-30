import express from "express";
import { getClientData, getProjects } from "../controllers/client/c-read";
import {
  addClientUser,
  createClient,
  createClientProject,
  createClientUser,
} from "../controllers/client/c-create";
import { deleteClient } from "../controllers/client/c-delete";
import { updateClient } from "../controllers/client/c-update";

const clientRoute = express.Router();

// GET
clientRoute.get("/:id", getClientData);
clientRoute.get("/:id/projects", getProjects);

// POST
clientRoute.post("/", createClient);
clientRoute.post("/:id/create-user", createClientUser);
clientRoute.post("/:id/add-user", addClientUser);
clientRoute.post("/:id/project", createClientProject);

// UPDATE
clientRoute.put("/:id", updateClient);

// DELETE
clientRoute.delete("/:id", deleteClient);

export default clientRoute;
