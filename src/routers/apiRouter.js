import express from "express";
import {
  deleteComment,
  createComment,
  registerView,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/video/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/comment/:id([0-9a-f]{24})", createComment);
apiRouter.delete("/comment/delete/:id([0-9a-f]{24})", deleteComment);

export default apiRouter;
