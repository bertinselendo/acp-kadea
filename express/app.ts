import express, { type Request, type Response } from "express";
import {
  authenticatedUser,
  currentSession,
} from "./middleware/auth.middleware.js";
import authRouter from "./routes/auth.route.js";
import clientRoute from "./routes/client.js";
import organizationRoute from "./routes/organization.js";
import userRoute from "./routes/user.js";
import projectRoute from "./routes/project.js";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);

// Parse incoming requests data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set session in res.locals
app.use(currentSession);

// get routes
app.use("/organization", authenticatedUser, organizationRoute);
app.use("/client", authenticatedUser, clientRoute);
app.use("/user", authenticatedUser, userRoute);
app.use("/project", authenticatedUser, projectRoute);

app.use("/", authRouter);

// get protected route
app.get(
  "/api/protected",
  authenticatedUser,
  async (_req: Request, res: Response) => {
    res.json(res.locals.session);
  }
);

// index route
app.get("/", (req: Request, res: Response) => {
  const { session } = res.locals;
  res.send({ message: "This is a root of server 😇", user: session?.user });
});

const PORT = process.env.PORT || 3005;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default server;
