import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { createExam, getExams } from "../controllers/examController.js";
import {
  createQuestion,
  getQuestionsByExamId,
} from "../controllers/quesController.js";
import {
  getCheatingLogsByExamId,
  saveCheatingLog,
} from "../controllers/cheatingLogController.js";
const examRoutes = express.Router();

  // protecting Exam route using auth middleware protect /api/users/
  // examRoutes.js - Remove "/exam" from the routes since it's now in the base path
  examRoutes.route("/").get(protect, getExams).post(protect, createExam);
  examRoutes.route("/questions").post(protect, createQuestion);
  examRoutes.route("/questions/:examId").get(protect, getQuestionsByExamId);
  examRoutes.route("/cheatingLogs/:examId").get(protect, getCheatingLogsByExamId);
  examRoutes.route("/cheatingLogs/").post(protect, saveCheatingLog);

export default examRoutes;
