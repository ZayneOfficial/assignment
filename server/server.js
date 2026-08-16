require("dotenv").config();
const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const authRoutes=require("./routes/auth");
const assignmentRoutes=require("./routes/assignments");
const submissionRoutes=require("./routes/submissions");

const app=express();
app.use(cors({origin:process.env.CLIENT_URL||"http://localhost:5173"}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ZayneTutor API is running",
    status: "online"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "ZayneTutor API is running"
  });
});
app.use("/api/auth",authRoutes);
app.use("/api/assignments",assignmentRoutes);
app.use("/api/submissions",submissionRoutes);

const PORT=process.env.PORT||5000;
mongoose.connect(process.env.MONGO_URI)
 .then(()=>app.listen(PORT,()=>console.log(`Server running on port ${PORT}`)))
 .catch(err=>{console.error("MongoDB connection failed:",err.message);process.exit(1)});
