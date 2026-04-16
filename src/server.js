import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ DB Connected");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on ${process.env.PORT}`)
    );
  })
  .catch(err => console.log(err));