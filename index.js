import  express  from "express";
import cors from "cors";
import storyRoute from "./routes/stories.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";
import commentsRoute from "./routes/comments.js";
import likesRoute from "./routes/likes.js";
import cookieParser from "cookie-parser";
import cookieSession from 'cookie-session';

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
/*
  app.use(cors({
    origin: 'http://localhost:10927',
    credentials: true
  }));
*/
  app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }));

app.use(express.json())
app.use(cookieParser())

app.use("/api/story", storyRoute)

app.use("/api/users", userRoute)

app.use("/api/auth", authRoute)

app.use("/api/comments", commentsRoute)

app.use("/api/likes", likesRoute)

app.listen(8800,()=>{
    console.log("Connected")
})