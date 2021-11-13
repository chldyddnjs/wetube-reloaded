//api는 백엔드가 템플릿을 렌더링하지 않을 때 프론트와 백엔드가 통신하는 방법을 말한다.
import express from "express";
import { createComment, deleteComment, registerView } from "../controllers/videoController";
const apiRouter = express.Router();

//form을 사용하지 않음
apiRouter.post("/videos/:id([0-9a-f]{24})/view",registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment",createComment);
apiRouter.delete("/videos/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})",deleteComment);
export default apiRouter;