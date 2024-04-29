import express from "express";
import { getUserByEmail, getUserClient } from "../controllers/user/u-read";
import { deleteUser } from "../controllers/user/u-delete";

const userRoute = express.Router();

// GET
userRoute.get("/email/:email", getUserByEmail);
userRoute.get("/:id/client", getUserClient);

// DELETE
userRoute.delete("/:id", deleteUser);

export default userRoute;
