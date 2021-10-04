import express from "express";
import { getEdit,postEdit,remove,logout,see, startGithunLogin, finishGithubLogin, getChangePassword, postChangePassword } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";
const userRouter = express.Router();
userRouter.get("/logout",protectorMiddleware,logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/delete",remove);
userRouter.get("/github/start",publicOnlyMiddleware,startGithunLogin);
userRouter.get("/github/finish",publicOnlyMiddleware,finishGithubLogin);
userRouter.get(":id",see);

export default userRouter;