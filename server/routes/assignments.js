const router=require("express").Router();
const Assignment=require("../models/Assignment");
const auth=require("../middleware/auth");

router.get("/",auth,async(req,res)=>{
 const filter=req.user.role==="admin"?{}:{grade:req.user.grade,published:true};
 res.json(await Assignment.find(filter).sort({createdAt:-1}));
});
router.get("/:id",auth,async(req,res)=>{
 const a=await Assignment.findById(req.params.id);
 if(!a)return res.status(404).json({message:"Assignment not found"});
 if(req.user.role!=="admin"&&(!a.published||a.grade!==req.user.grade))return res.status(403).json({message:"Not available"});
 res.json(a);
});
router.post("/",auth,async(req,res)=>{
 if(req.user.role!=="admin")return res.status(403).json({message:"Admin only"});
 try{res.status(201).json(await Assignment.create(req.body))}catch(e){res.status(400).json({message:e.message})}
});
router.patch("/:id",auth,async(req,res)=>{
 if(req.user.role!=="admin")return res.status(403).json({message:"Admin only"});
 res.json(await Assignment.findByIdAndUpdate(req.params.id,req.body,{new:true}));
});
router.delete("/:id",auth,async(req,res)=>{
 if(req.user.role!=="admin")return res.status(403).json({message:"Admin only"});
 await Assignment.findByIdAndDelete(req.params.id);res.json({message:"Deleted"});
});
module.exports=router;
