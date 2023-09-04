import { Router } from "express";
import { avatarUpload } from "../../controllers/account.js";
import { CheckRoleAccount } from "../../middlewares/check.js";
import { uploadFile } from "../../middlewares/multer.js";

const AvatarUploadRouter = Router();
AvatarUploadRouter.use(CheckRoleAccount);
AvatarUploadRouter.post("/",uploadFile.single("avatar"), avatarUpload);

export default AvatarUploadRouter;