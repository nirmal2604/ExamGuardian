import express from "express";
import dotenv from "dotenv";

import cors from "cors"; // Add this import
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import examRoutes from "./routes/examRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",    
  "http://localhost:5173",    
  "https://exam-guardian.vercel.app"  // Placeholder
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// app.use(cors({
//   origin: function (origin, callback) {
//     console.log(">> Incoming origin:", origin);
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));

// app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
// server.js
app.use("/api/users", userRoutes);
app.use("/api/exam", examRoutes);  // Change this to /api/exams
app.use("/api/submissions", submissionRoutes);

// Simple API status endpoint (removed static file serving for separate deployment)
app.get("/", (req, res) => {
  res.json({ 
    message: "API is running successfully",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get('/api/debug-cookie', (req, res) => {
  res.json({
    cookie: req.cookies?.jwt || null,
    message: req.cookies?.jwt ? 'JWT received' : 'No JWT in cookies',
  });
});


// Custom Middlewares
app.use(notFound);
app.use(errorHandler);

// Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
