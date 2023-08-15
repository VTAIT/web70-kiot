import { Router } from "express";
import AuthRoute from "./auth/index.js";

const RootRoute = Router();

RootRoute.use("/auth", AuthRoute);

export default RootRoute;