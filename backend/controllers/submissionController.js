import asyncHandler from "express-async-handler";
import Submission from "../models/submissionModel.js";
import Question from "../models/quesModel.js";
import Exam from "../models/examModel.js";

// @desc Submit exam answers
// @route POST /api/submissions
// @access Private (students)
const submitExam = asyncHandler(async (req, res) => {
  const { examId, answers, totalTimeSpent } = req.body;
  const studentId = req.user._id;

  // Check if submission already exists
  const existingSubmission = await Submission.findOne({ studentId, examId });
  if (existingSubmission) {
    res.status(400);
    throw new Error("Exam already submitted");
  }

  // Get exam details
  const exam = await Exam.findOne({ examId });
  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  // Get all questions for this exam
  const questions = await Question.find({ examId });
  if (!questions || questions.length === 0) {
    res.status(404);
    throw new Error("No questions found for this exam");
  }

  // Process answers and calculate scores
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unansweredQuestions = 0;
  const processedAnswers = [];

  // Create a map of questions for easy lookup
  const questionMap = {};
  questions.forEach(q => {
    questionMap[q._id.toString()] = q;
  });

  // Process each answer
  answers.forEach(answer => {
    const question = questionMap[answer.questionId];
    if (question) {
      // Find the correct option and selected option
      const correctOption = question.options.find(opt => opt.isCorrect);
      const selectedOption = question.options.find(opt => opt._id.toString() === answer.studentAnswer);
      
      // Get the text values for display
      const correctAnswerText = correctOption ? correctOption.optionText : "";
      const selectedAnswerText = selectedOption ? selectedOption.optionText : "";
      
      // Check if answer is correct by comparing ObjectIds
      const isCorrect = answer.studentAnswer === correctOption?._id.toString();
      
      if (answer.studentAnswer === "" || answer.studentAnswer === null || answer.studentAnswer === undefined) {
        unansweredQuestions++;
      } else if (isCorrect) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }

      processedAnswers.push({
        questionId: answer.questionId,
        studentAnswer: selectedAnswerText, // Store the text for display
        correctAnswer: correctAnswerText,  // Store the text for display
        isCorrect: isCorrect,
        timeSpent: answer.timeSpent || 0,
      });
    }
  });

  // Calculate total score and percentage
  const totalQuestions = questions.length;
  const totalScore = correctAnswers;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Create submission
  const submission = new Submission({
    studentId,
    examId,
    answers: processedAnswers,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    totalScore,
    percentage,
    totalTimeSpent: totalTimeSpent || 0,
    status: "completed",
  });

  const createdSubmission = await submission.save();

  if (createdSubmission) {
    res.status(201).json({
      message: "Exam submitted successfully",
      submission: {
        _id: createdSubmission._id,
        examId: createdSubmission.examId,
        totalScore: createdSubmission.totalScore,
        percentage: createdSubmission.percentage,
        correctAnswers: createdSubmission.correctAnswers,
        incorrectAnswers: createdSubmission.incorrectAnswers,
        submittedAt: createdSubmission.submittedAt,
      },
    });
  } else {
    res.status(400);
    throw new Error("Failed to submit exam");
  }
});

// @desc Get student result for a specific exam
// @route GET /api/submissions/:examId
// @access Private (students)
const getStudentResult = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const studentId = req.user._id;

  const submission = await Submission.findOne({ studentId, examId })
    .populate("studentId", "name email")
    .populate({
      path: "answers.questionId",
      select: "question options",
    });

  if (!submission) {
    res.status(404);
    throw new Error("No submission found for this exam");
  }

  // Get exam details
  const exam = await Exam.findOne({ examId });

  res.status(200).json({
    submission,
    exam,
  });
});

// @desc Get all results for a student
// @route GET /api/submissions/student/all
// @access Private (students)
const getAllStudentResults = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const submissions = await Submission.find({ studentId })
    .populate("studentId", "name email")
    .sort({ submittedAt: -1 });

  // Get exam details for each submission
  const results = [];
  for (const submission of submissions) {
    const exam = await Exam.findOne({ examId: submission.examId });
    results.push({
      submission,
      exam,
    });
  }

  res.status(200).json(results);
});

// @desc Get all submissions for an exam (for teachers)
// @route GET /api/submissions/exam/:examId/all
// @access Private (teachers)
const getExamSubmissions = asyncHandler(async (req, res) => {
  const { examId } = req.params;

  // Check if user is teacher
  if (req.user.role !== "teacher") {
    res.status(403);
    throw new Error("Access denied. Teachers only.");
  }

  const submissions = await Submission.find({ examId })
    .populate("studentId", "name email")
    .sort({ submittedAt: -1 });

  // Get exam details
  const exam = await Exam.findOne({ examId });

  res.status(200).json({
    exam,
    submissions,
  });
});

export {
  submitExam,
  getStudentResult,
  getAllStudentResults,
  getExamSubmissions,
};