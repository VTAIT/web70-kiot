import { Router } from "express";
import { getAll, getById } from "../../controllers/kiot.js";

const ReadRouter = Router();

ReadRouter.get('/', getAll);

ReadRouter.get('/getById', getById);

export default ReadRouter;