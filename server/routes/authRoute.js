import express from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOTP, verifyEmail } from "../controller/AuthController.js";
import userAuth from "../middleware/userAuth.js";
// import { login, logout, register } from "../controller/authController.js";
const authRouter =express.Router();

// /api/auth/register
// /api/auth/login
// /api/auth/logout
authRouter.post("/register", register )
authRouter.post("/login", login )
authRouter.post("/logout", logout )
authRouter.post("/send-verify-otp", userAuth, sendVerifyOTP)
authRouter.post("/verify-account", userAuth, verifyEmail )
authRouter.post("/is-auth", userAuth, isAuthenticated )
authRouter.post("/send-reset-otp", sendResetOtp )
authRouter.post("/reset-password", resetPassword)



export default authRouter;