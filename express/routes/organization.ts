import express from "express";
import {
  getAllOrgStats,
  getClients,
  getOrganization,
  getProjects,
  getTeamMembers,
} from "../controllers/organization/o-read";
import { createOrganization } from "../controllers/organization/o-create";

const organizationRoute = express.Router();

// GET
organizationRoute.get("/:id", getOrganization);
organizationRoute.get("/:id/team", getTeamMembers);
organizationRoute.get("/:id/clients", getClients);
organizationRoute.get("/:id/stats", getAllOrgStats);
organizationRoute.get("/:id/projects", getProjects);

// POST
organizationRoute.post("/", createOrganization);

export default organizationRoute;
