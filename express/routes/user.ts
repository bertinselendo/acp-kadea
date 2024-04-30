import express from "express";
import {
  getUserByEmail,
  getUserClient,
  getUserProjects,
} from "../controllers/user/u-read";
import { deleteUser } from "../controllers/user/u-delete";

const userRoute = express.Router();

// GET
userRoute.get("/email/:email", getUserByEmail);
userRoute.get("/:id/client", getUserClient);
userRoute.get("/:id/projects", getUserProjects);

// DELETE
userRoute.delete("/:id", deleteUser);

export default userRoute;
