require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const assignmentRoutes = require("./routes/assignments");
const submissionRoutes = require("./routes/submissions");

const app = express();

// Allow the frontend to communicate with the API
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "ZayneTutor API is running",
    status: "online"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "ZayneTutor API is running"
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });