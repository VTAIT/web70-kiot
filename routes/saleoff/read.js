import { Router } from "express";
import { getAll, getAll_query, getById } from "../../controllers/saleoff.js";

const ReadRouter = Router();

ReadRouter.get("/", getAll);
ReadRouter.get("/query", getAll_query);
ReadRouter.get("/getById", getById);

export default ReadRouter;
