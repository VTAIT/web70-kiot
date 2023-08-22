import { Router } from "express";
import { acceptById, getAllAccept } from "../../controllers/account.js";


const AcceptRouter = Router();
AcceptRouter.get('/', getAllAccept);
AcceptRouter.post('/', acceptById);

export default AcceptRouter;