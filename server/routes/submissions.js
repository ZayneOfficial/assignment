const router=require("express").Router();
const Assignment=require("../models/Assignment");
const Submission=require("../models/Submission");
const auth=require("../middleware/auth");

router.post("/:id",auth,async(req,res)=>{
 if(req.user.role!=="student")return res.status(403).json({message:"Students only"});
 const assignment=await Assignment.findById(req.params.id);
 if(!assignment||!assignment.published||assignment.grade!==req.user.grade)return res.status(404).json({message:"Assignment not available"});
 const existing=await Submission.findOne({student:req.user.id,assignment:assignment._id});
 if(existing)return res.status(400).json({message:"You already submitted this assignment"});
 const answers=req.body.answers||{};
 let score=0;
 assignment.questions.forEach((q,i)=>{if(answers[String(i)]===q.correctAnswer)score++});
 const total=assignment.questions.length;
 const percentage=total?Math.round(score/total*100):0;
 const sub=await Submission.create({student:req.user.id,assignment:assignment._id,answers,score,total,percentage});
 res.json({score,total,percentage,submissionId:sub._id});
});
router.get("/mine",auth,async(req,res)=>{
 const data=await Submission.find({student:req.user.id}).populate("assignment","title grade");
 res.json(data);
});
router.get("/all",auth,async(req,res)=>{
 if(req.user.role!=="admin")return res.status(403).json({message:"Admin only"});
 res.json(await Submission.find().populate("student","name grade").populate("assignment","title grade").sort({createdAt:-1}));
});
module.exports=router;
