const mongoose=require("mongoose");
module.exports=mongoose.model("Submission",new mongoose.Schema({
 student:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 assignment:{type:mongoose.Schema.Types.ObjectId,ref:"Assignment",required:true},
 answers:{type:Map,of:String,default:{}},
 score:{type:Number,default:0},
 total:{type:Number,default:0},
 percentage:{type:Number,default:0}
},{timestamps:true}));
