import  express  from "express";
import cors from "cors";
import storyRoute from "./routes/stories.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";
import cookieParser from "cookie-parser";
const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

app.use(express.json())
app.use(cookieParser())

app.use("/api/story", storyRoute)

app.use("/api/users", userRoute)

app.use("/api/auth", authRoute)

app.listen(8800,()=>{
    console.log("Connected")
})