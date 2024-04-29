import express from "express";
import { getClientData, getProjects } from "../controllers/client/c-read";
import {
  addClientUser,
  createClient,
  createClientUser,
} from "../controllers/client/c-create";

const clientRoute = express.Router();

// GET
clientRoute.get("/:id", getClientData);
clientRoute.get("/:id/projects", getProjects);

// POST
clientRoute.post("/", createClient);
clientRoute.post("/:id/create-user", createClientUser);
clientRoute.post("/:id/add-user", addClientUser);

export default clientRoute;
