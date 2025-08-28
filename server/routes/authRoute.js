import express from "express";
import { login, logout, register } from "../controller/authController.js";
const authRouter =express.Router();

// /api/auth/register
// /api/auth/login
// /api/auth/logout
authRouter.post("/register", register )
authRouter.post("/login", login )
authRouter.post("/logout", logout )

export default authRouter;