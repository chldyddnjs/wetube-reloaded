import express from "express";
import { getEdit,postEdit,remove,logout,see, startGithunLogin, finishGithubLogin } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";
const userRouter = express.Router();
userRouter.get("/logout",protectorMiddleware,logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/delete",remove);
userRouter.get("/github/start",publicOnlyMiddleware,startGithunLogin);
userRouter.get("/github/finish",publicOnlyMiddleware,finishGithubLogin);
userRouter.get(":id",see);

export default userRouter;