import { Router } from "express";
import { acceptById, getAllAccept } from "../../controllers/account.js";
import { CheckSuper } from "../../middlewares/check.js";
import { checkIP } from "../../middlewares/osinfo.js";

const AcceptRouter = Router();
AcceptRouter.use([CheckSuper]);
AcceptRouter.get('/', getAllAccept);
AcceptRouter.post('/', acceptById);

export default AcceptRouter;