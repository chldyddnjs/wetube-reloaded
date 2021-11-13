import express from "express";
import { watch,getEdit,postEdit,deleteVideo, getUpload, postUpload } from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";
const videoRouter = express.Router();

videoRouter.route("/:id([0-9a-f]{24})").get(watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postUpload);

export default videoRouter;