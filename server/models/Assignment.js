const mongoose=require("mongoose");
const Question=new mongoose.Schema({
 text:{type:String,required:true},
 options:{type:[String],validate:v=>v.length===4},
 correctAnswer:{type:String,enum:["A","B","C","D"],required:true}
});
module.exports=mongoose.model("Assignment",new mongoose.Schema({
 title:{type:String,required:true},
 description:String,
 grade:{type:Number,required:true},
 timeLimit:{type:Number,default:30},
 dueDate:Date,
 published:{type:Boolean,default:false},
 questions:{type:[Question],default:[]}
},{timestamps:true}));
