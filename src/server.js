import express, { Router } from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "../src/routers/userRouter";
import videoRouter from "../src/routers/videoRouter";
import apiRouter from "../src/routers/apiRouter";
import { localsMiddleware } from "../src/middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false, // 아무런 변경사항이 없을 시에도 세션을 저장할 것이냐
    saveUninitialized: false, // 새로 생성된 세션에서 아무 작업이 이루어지지 않았어도 세션을 저장할 것이냐
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);
app.use("/api", apiRouter);

export default app;
