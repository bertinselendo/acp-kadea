import express from "express";
import {
  getProject,
  getProjectAllUsers,
  getProjectCredentials,
  getProjectDocuments,
  getProjectFeedbacks,
  getProjectInvoices,
} from "../controllers/projects/p-read";
import {
  removeTeamMember,
  updateProject,
} from "../controllers/projects/p-update";
import {
  createCredential,
  createDocument,
  createFeedback,
  createInvoice,
} from "../controllers/projects/p-create";
import { deleteProject } from "../controllers/projects/p-delete";

const projectRoute = express.Router();

// GET
projectRoute.get("/:id", getProject);
projectRoute.get("/:id/users", getProjectAllUsers);
projectRoute.get("/:id/feedbacks", getProjectFeedbacks);
projectRoute.get("/:id/documents", getProjectDocuments);
projectRoute.get("/:id/invoices", getProjectInvoices);
projectRoute.get("/:id/credentials", getProjectCredentials);

// POST
projectRoute.post("/:id/feedback", createFeedback);
projectRoute.post("/:id/document", createDocument);
projectRoute.post("/:id/invoice", createInvoice);
projectRoute.post("/:id/credential", createCredential);

// UPDATE
projectRoute.put("/:id", updateProject);
projectRoute.put("/:id/remove-team", removeTeamMember);

// DELETE
projectRoute.delete("/:id", deleteProject);

export default projectRoute;
