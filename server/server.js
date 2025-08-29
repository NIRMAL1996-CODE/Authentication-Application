import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectdb from "./config/db.js";
import authRouter from "./routes/authRoute.js"
import userRouter from "./routes/userRoutes.js";

const app = express();
const port =process.env.PORT || 3000;
connectdb();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

//API endpoints
app.get("/", (req, res)=>res.send("API is working"));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)


app.listen(port ,()=>console.log(`serverstarts on ${port}`)
);

