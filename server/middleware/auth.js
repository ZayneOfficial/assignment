const jwt=require("jsonwebtoken");
module.exports=(req,res,next)=>{
 const token=(req.headers.authorization||"").replace("Bearer ","");
 if(!token)return res.status(401).json({message:"Login required"});
 try{req.user=jwt.verify(token,process.env.JWT_SECRET);next()}
 catch(e){res.status(401).json({message:"Invalid token"})}
};
