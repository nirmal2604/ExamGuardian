import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  submitExam,
  getStudentResult,
  getAllStudentResults,
  getExamSubmissions,
  getAllExamsOverview,
  getExamAnalytics,
} from "../controllers/submissionController.js";

const submissionRoutes = express.Router();

// All routes are protected - require authentication
// Submit exam answers
submissionRoutes.route("/").post(protect, submitExam);

// Get student result for a specific exam
submissionRoutes.route("/:examId").get(protect, getStudentResult);

// Get all results for the logged-in student
submissionRoutes.route("/student/all").get(protect, getAllStudentResults);

// Get all submissions for an exam (teachers only)
submissionRoutes.route("/exam/:examId/all").get(protect, getExamSubmissions);

// Get teacher's exams overview with stats
submissionRoutes.route("/teacher/all-exams").get(protect, getAllExamsOverview);

// Get detailed analytics for a specific exam
submissionRoutes.route("/exam/:examId/analytics").get(protect, getExamAnalytics);

export default submissionRoutes;