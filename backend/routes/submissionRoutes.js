import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  submitExam,
  getStudentResult,
  getAllStudentResults,
  getExamSubmissions,
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

export default submissionRoutes;