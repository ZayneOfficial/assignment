const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/User");

router.post("/register",async(req,res)=>{
 try{
  const {name,grade,password}=req.body;
  if(!name||!grade||!password)return res.status(400).json({message:"Name, grade and password are required"});
  if(await User.findOne({name}))return res.status(400).json({message:"User already exists"});
  const user=await User.create({name,grade,password:await bcrypt.hash(password,10)});
  res.status(201).json({message:"Registered successfully"});
 }catch(e){res.status(500).json({message:e.message})}
});
router.post("/login",async(req,res)=>{
 try{
  const {name,password}=req.body;
  const user=await User.findOne({name});
  if(!user||!(await bcrypt.compare(password,user.password)))return res.status(401).json({message:"Invalid login"});
  const token=jwt.sign({id:user._id,name:user.name,grade:user.grade,role:user.role},process.env.JWT_SECRET,{expiresIn:"1d"});
  res.json({token,user:{name:user.name,grade:user.grade,role:user.role}});
 }catch(e){res.status(500).json({message:e.message})}
});
module.exports=router;
