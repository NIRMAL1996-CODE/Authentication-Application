import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {type:String, required: true},
  email: {type:String, required: true, unique: true},
  password: {type:String, required: true},
  verifyOTP: {type:String, default: ""},
  verifyOtpExpire: {type: Number, default:0},
  isAccountverified : {type: Boolean, default:false},
  resetOTP:{type: String,default: "" },
  resetOTPExpire:{type: Number,default: 0 }
});

const Usermodel =model("User", userSchema);

export default Usermodel;