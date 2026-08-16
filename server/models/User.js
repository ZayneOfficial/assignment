const mongoose=require("mongoose");
module.exports=mongoose.model("User",new mongoose.Schema({
 name:{type:String,required:true,trim:true},
 grade:{type:Number,required:true},
 password:{type:String,required:true},
 role:{type:String,enum:["student","admin"],default:"student"}
},{timestamps:true}));
