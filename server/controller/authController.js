import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usermodel from "../models/usermodel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res)=>{
  const {name, email, password}=req.body;
  if(!name || !email || !password){
    return res.json({success:false, message: 'Missing Details'})
  }
  try{

    const existingUser =await Usermodel.findOne({email})
    if(existingUser){
     return res.json({success:false, message: 'User already exists'});
    }

     const hashedPassword= await bcrypt.hash(password, 10)
     const user= new Usermodel({name, email, password:hashedPassword});
     await user.save();
    
     const token =jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
      res.cookie('token',token,
      {   httpOnly:true,
          secure:process.env.NODE_ENV==="production",
          sameSite: process.env.NODE_ENV==="production"? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000
       });

       const mailOptions= {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome To CodeCode",
        text:`Welcome to CodeCode Website. Your account has been created with email id:${email}`
       }
       await transporter.sendMail(mailOptions);

        return res.json({success:true});
  }catch(error){
    console.error(error);
    res.json({success:false, message: error.message})
  }
}

export const login = async (req, res)=>{
  const {email, password}=req.body;
   if(!email || !password){
    return res.json({success:false, message: 'Email and Password are required'})
   }
   try {
    const user =await Usermodel.findOne({email})
    if(!user){
      return res.json({success:false, message: 'Invalid Email'});
    }
    const isMatch= await bcrypt.compare(password, user.password )
     if(!isMatch){
      return res.json({success:false, message: 'Invalid Password'});
    }
     
    if (!user.isAccountverified) {
      return res.json({ success:false, message: 'Please verify your email before login' });
    }
      const token =jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
          res.cookie('token',token,
       {  httpOnly:true,
          secure:process.env.NODE_ENV==="production",
          sameSite: process.env.NODE_ENV==="production"? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000
       });
       return res.json({success:true});
   }catch(error){
    res.json({success:false, message: error.message})
  }
}

export const logout =async (req,res)=>{
  try {
    res.clearCookie('token',{
      httpOnly:true,
          secure:process.env.NODE_ENV==="production",
          sameSite: process.env.NODE_ENV==="production"? "none" : "strict"
    })
    return res.json({success:true, message:"logged Out "});
  } catch (error) {
    res.json({success:false, message: error.message})
  }
}

//send otp to user's email for verification
export const sendVerifyOTP =async (req, res)=>{
try {
  // const {userId}= req.body; 
  const userId = req.body.userId; // set by userAuth middleware

  const user =await Usermodel.findById(userId);
   if (!user) {
  return res.json({ success:false, message:"User not found" });
}
  if(user.isAccountverified){
    return res.json({success:false, message:"Account Already verified"});
    }
  const otp= String(Math.floor(100000+Math.random()*900000))
    user.verifyOTP=otp;
    user.verifyOtpExpire= Date.now()+ 24 *60 *60 *1000;
    await user.save();

   const mailOptions= {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Account verification otp",
        text:`your OTP :${otp}. Verify your account using this OTP.`
       }
     await transporter.sendMail(mailOptions);
     res.json({success:true, message:'Verification OTP sent on Email'});
     
} catch (error) {
  res.json({success:false, message: error.message})
}
}

export const  verifyEmail= async (req, res)=>{
  const {otp}= req.body;
  const userId= req.body.userId;

    if(!userId || !otp){
    return res.json({success:false, message: 'Missing Details'})
}
try {
  const user =await Usermodel.findById(userId);
  if(!user){
    return res.json({success:false, message:"User not found"});
  }
   if(user.isAccountverified){
    return res.json({success:false, message:"Account Already verified"});
    }
  if(user.verifyOTP=== '' || user.verifyOTP !== otp){
    return res.json({success:false, message:"Invalid OTP"});
  }
  if(user.verifyOtpExpire < Date.now()){
    return res.json({success:false, message:"OTP expired"});
  }
   
  user.isAccountverified = true;
  user.verifyOTP= '';
  user.verifyOtpExpire= 0;
    await user.save();
     return res.json({success: true, message:"Email verified successfully"});

} catch (error) {
  res.json({success:false, message: error.message})
}
}

// check if user is authenticated
export const isAuthenticated= (req, res)=>{
try {
  return res.json({success:true});
} catch (error) {
  res.json({success:false, message: error.message})
}
}

// send password reset otp
export const sendResetOtp= async (req, res)=>{
  const {email}=req.body;
  if(!email){
    return res.json({success:false, message:"Email is required"});
  }
  try {
    const user= await Usermodel.findOne({email});
    if(!user){
         return res.json({success:false, message:" The User not found"});
    }

    const otp= String(Math.floor(100000+Math.random()*900000))
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now()+ 15 *60 *1000;
    await user.save();

   const mailOptions= {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Password Reset OTP",
        text:`your OTP :${otp} to reset your password.`
       }
     await transporter.sendMail(mailOptions);
    return res.json({success:true, message:" OTP send to your Email "});

  } catch (error) {
     res.json({success:false, message: error.message})
  }
}

// Reset user password
export const resetPassword =async (req, res)=>{
const {email, otp, newPassword} =req.body;
if(!email || !otp || !newPassword){
   return res.json({success:false, message:" Email, OTP, Password required "});
}
try {
   const user= await Usermodel.findOne({email});
    if(!user){
         return res.json({success:false, message:" The User not found"});
    }
    if(user.resetOTP==='' || user.resetOTP!== otp){
    return res.json({success:false, message:"Invalid OTP"});
    }
     if(user.resetOTPExpire  < Date.now()){
    return res.json({success:false, message:"OTP expired"});
     }
     const hashedPassword= await bcrypt.hash(newPassword , 10);

     user.password=hashedPassword;
     user.resetOTP= '';
     user.resetOTPExpire= 0;
     await user.save();
         return res.json({success:true, message:"Password has reset successfully"});

} catch (error) {
  res.json({success:false, message: error.message})
}
}