import { Router } from "express";
import AuthRoute from "./auth/index.js";
import ProductRoute from "./product/index.js";
import AccountRoute from "./account/index.js";
import KiotRoute from "./kiot/index.js";

const RootRoute = Router();

RootRoute.use("/auth", AuthRoute);
RootRoute.use("/product", ProductRoute);
RootRoute.use("/account", AccountRoute);
RootRoute.use("/kiot", KiotRoute);

export default RootRoute;