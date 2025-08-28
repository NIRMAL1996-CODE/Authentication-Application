import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectdb from "./config/db.js";
import authRouter from "./routes/authRoute.js"

const app = express();
dotenv.config();
const port =process.env.PORT || 3000;
connectdb();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

//API endpoints
app.get("/", (req, res)=>res.send("API is working"));
app.use('/api/auth', authRouter)

app.listen(port ,()=>console.log(`serverstarts on ${port}`)
);

