import Usermodel  from "../models/usermodel.js";
export const getUserData =async (req, res)=>{
  try {
    const {userId}= req.body;
     const user= await Usermodel.findById(userId);
    if(!user){
         return res.json({success:false, message:" The User not found"});
    }
         return res.json({
          success:true,
          userdata:{
            name:user.name,
            isAccountverified: user.isAccountverified
          }
                      
         });

  } catch (error) {
  res.json({success:false, message: error.message})
    
  }
}