import mongoose from "mongoose";
const connectdb =async()=>{
  // mongoose.connection.on(`connected`,()=>console.log("Databse connedted"));

    try {
    await mongoose.connect(process.env.MONGODB_URI + "/myDataBase"); // myDB = your database name
    console.log("MongoDB Connected");
  }
   catch (error) {
    console.error("MongoDB Error", error.message);
  }
};

export default connectdb;