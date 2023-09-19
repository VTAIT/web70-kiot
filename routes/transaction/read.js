import { Router } from "express";
import { getAll, getAllReport, getById } from "../../controllers/transaction.js";

const ReadRouter = Router();

ReadRouter.get('/', getAll);

ReadRouter.get('/getById', getById);

ReadRouter.get('/report', getAllReport);

export default ReadRouter;