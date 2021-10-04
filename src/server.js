import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import MongoStore from "connect-mongo";
import session from "express-session";
import { localsMiddleware } from "./middlewares";


const app = express();

const logger = morgan("dev");

app.set("view engine","pug");
app.set("views",process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    //세션을 수정할 때만 db에 쿠키 값을 넘겨준다.
    resave:false,
    saveUninitialized:false,
    cookie:{
        // maxAge:20000,
    },
    store:MongoStore.create({mongoUrl:process.env.DB_URL}),
    })
);

app.use(localsMiddleware);
app.use("/",rootRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);

export default app;