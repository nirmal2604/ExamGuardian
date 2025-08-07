import asyncHandler from "express-async-handler";
import Submission from "../models/submissionModel.js";
import Question from "../models/quesModel.js";
import Exam from "../models/examModel.js";
import { GoogleGenerativeAI } from '@google/generative-ai';

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

// @desc Get all exams created by teacher with basic stats
// @route GET /api/submissions/teacher/all-exams
// @access Private (teachers only)
const getAllExamsOverview = asyncHandler(async (req, res) => {
  // Check if user is teacher
  if (req.user.role !== "teacher") {
    res.status(403);
    throw new Error("Access denied. Teachers only.");
  }

  // Get all exams created by this teacher
  const teacherExams = await Exam.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

  // Get stats for each exam
  const examOverview = [];
  
  for (const exam of teacherExams) {
    // Get submission stats for this exam
    const submissions = await Submission.find({ examId: exam.examId });
    
    const totalSubmissions = submissions.length;
    const averageScore = totalSubmissions > 0 
      ? Math.round(submissions.reduce((sum, sub) => sum + sub.percentage, 0) / totalSubmissions)
      : 0;
    
    const highestScore = totalSubmissions > 0 
      ? Math.max(...submissions.map(sub => sub.percentage))
      : 0;
    
    const lowestScore = totalSubmissions > 0 
      ? Math.min(...submissions.map(sub => sub.percentage))
      : 0;

    examOverview.push({
      examId: exam.examId,
      examName: exam.examName,
      totalQuestions: exam.totalQuestions,
      duration: exam.duration,
      liveDate: exam.liveDate,
      deadDate: exam.deadDate,
      createdAt: exam.createdAt,
      stats: {
        totalSubmissions,
        averageScore,
        highestScore,
        lowestScore,
      }
    });
  }

  res.status(200).json({
    message: "Teacher exams overview retrieved successfully",
    exams: examOverview,
  });
});

// AI Insights Generation Function using Gemini
const generateAIInsights = async (questionAnalytics, examData, overallStats) => {
  try {
    // 1. Initialize the Gemini API client with native JSON mode
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        // This is the most reliable way to force JSON output
        responseMimeType: "application/json"
      }
    });

    // 2. Validate essential inputs
    if (!Array.isArray(questionAnalytics)) {
        throw new Error("Invalid question analytics data: Input is not an array.");
    }

    const hasValidQuestions = questionAnalytics.every((q, index) => {
        const isValid = q.stats?.accuracy !== undefined && q.question !== undefined && q.stats?.answerDistribution !== undefined;
        if (!isValid) {
            console.error(`Validation failed for question at index ${index}:`);
            console.error(`Question: ${q.question}`);
            console.error(`- stats.accuracy is undefined: ${q.stats?.accuracy === undefined}`);
            console.error(`- question is undefined: ${q.question === undefined}`);
            console.error(`- stats.answerDistribution is undefined: ${q.stats?.answerDistribution === undefined}`);
        }
        return isValid;
    });

    if (!hasValidQuestions) {
        throw new Error("Invalid question analytics data: One or more question objects are malformed.");
    }

    // 3. Prepare data for AI analysis (existing code)
    const difficultQuestions = questionAnalytics
      .filter(q => q.stats.accuracy < 70)
      .slice(0, 5) // Top 5 most difficult
      .map(q => ({
        question: q.question.substring(0, 100) + '...', // Truncate long questions
        accuracy: q.stats.accuracy,
        averageTime: q.stats.averageTimeSpent,
        totalAttempts: q.stats.totalAttempts,
        commonWrongAnswers: Object.entries(q.stats.answerDistribution)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([answer, count]) => `"${answer}" (${count} students)`)
      }));

    // 4. Construct the prompt
    // With native JSON mode, the prompt can be simpler as the model is already constrained
    const prompt = `
Analyze this exam performance data and provide practical teaching insights. Do not include any text outside the JSON object.

EXAM OVERVIEW:
- Name: ${examData.examName}
- Total Questions: ${examData.totalQuestions}
- Students who took exam: ${overallStats.totalSubmissions}
- Class average: ${overallStats.averageScore}%

DIFFICULT QUESTIONS (Below 70% accuracy):
${difficultQuestions.map((q, i) =>
    `${i+1}. "${q.question}" - ${q.accuracy}% accuracy
      Common wrong answers: ${q.commonWrongAnswers.join(', ')}`
).join('\n')}

Return exactly this JSON structure:
{
  "performance_assessment": "Overall class performance assessment (max 100 words)",
  "struggling_topics": "Topics/concepts students struggle with most (max 100 words)",
  "misconceptions": "Common misconceptions based on wrong answer patterns (max 100 words)",
  "teaching_recommendations": "Specific, actionable teaching recommendations (max 100 words)"
}
Each value must be a plain text string, under 100 words. Do not deviate from this structure.
`;

    // 5. Call the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log('--- RAW GEMINI RESPONSE START ---');
    console.log(text);
    console.log('--- RAW GEMINI RESPONSE END ---');

    // 6. Log the raw response for debugging
    console.log('Raw Gemini response:', text);

    // 7. Clean and parse the response with a more robust regex
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('No JSON object found in the response.');
      throw new Error("Invalid response format: No JSON object detected.");
    }
    
    text = jsonMatch[0]; // Use the matched JSON string
    
    try {
      const parsed = JSON.parse(text);

      // 8. Validate the parsed JSON structure (existing code)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'performance_assessment' in parsed &&
        'struggling_topics' in parsed &&
        'misconceptions' in parsed &&
        'teaching_recommendations' in parsed
      ) {
        return parsed;
      }
      throw new Error("Response does not match required JSON structure after cleaning");
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError, 'Attempted to parse:', text);
      // Fallback for parsing errors
      return {
        performance_assessment: "AI insights temporarily unavailable.",
        struggling_topics: "Invalid response format from AI.",
        misconceptions: "",
        teaching_recommendations: ""
      };
    }

  } catch (error) {
    console.error('AI Insights generation failed:', error);
    // General error fallback
    return {
      performance_assessment: "AI insights temporarily unavailable.",
      struggling_topics: "Please try again later.",
      misconceptions: "",
      teaching_recommendations: ""
    };
  }
};

// @desc Get detailed analytics for a specific exam
// @route GET /api/submissions/exam/:examId/analytics
// @access Private (teachers only)
// @desc Get detailed analytics for a specific exam
// @route GET /api/submissions/exam/:examId/analytics
// @access Private (teachers only)
const getExamAnalytics = asyncHandler(async (req, res) => {
  const { examId } = req.params;

  // Check if user is teacher
  if (req.user.role !== "teacher") {
    res.status(403);
    throw new Error("Access denied. Teachers only.");
  }

  // Get exam details and verify ownership
  const exam = await Exam.findOne({ examId, createdBy: req.user._id });
  if (!exam) {
    res.status(404);
    throw new Error("Exam not found or you don't have permission to view it");
  }

  // Get all submissions for this exam
  const submissions = await Submission.find({ examId })
    .populate("studentId", "name email")
    .populate("answers.questionId");

  // Get all questions for this exam
  const questions = await Question.find({ examId });

  // Calculate overall exam statistics
  const totalSubmissions = submissions.length;
  const averageScore = totalSubmissions > 0 
    ? Math.round(submissions.reduce((sum, sub) => sum + sub.percentage, 0) / totalSubmissions)
    : 0;
  
  const scoreDistribution = {
    excellent: submissions.filter(sub => sub.percentage >= 90).length,
    good: submissions.filter(sub => sub.percentage >= 70 && sub.percentage < 90).length,
    average: submissions.filter(sub => sub.percentage >= 50 && sub.percentage < 70).length,
    poor: submissions.filter(sub => sub.percentage < 50).length,
  };

  // Question-wise analysis
  const questionAnalytics = [];
  
  for (const question of questions) {
    const questionSubmissions = submissions.flatMap(sub => 
      sub.answers.filter(ans => ans.questionId._id.toString() === question._id.toString())
    );

    const totalAttempts = questionSubmissions.length;
    const correctAttempts = questionSubmissions.filter(ans => ans.isCorrect).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
    
    // Count answer distribution
    const answerDistribution = {};
    questionSubmissions.forEach(ans => {
      const answer = ans.studentAnswer || "Unanswered";
      answerDistribution[answer] = (answerDistribution[answer] || 0) + 1;
    });

    const averageTimeSpent = totalAttempts > 0 
      ? Math.round(questionSubmissions.reduce((sum, ans) => sum + (ans.timeSpent || 0), 0) / totalAttempts)
      : 0;

    // PUSH A FULLY FORMED OBJECT FOR EVERY QUESTION
    questionAnalytics.push({
      questionId: question._id,
      question: question.question,
      options: question.options,
      stats: {
        totalAttempts,
        correctAttempts,
        accuracy,
        averageTimeSpent,
        answerDistribution,
      }
    });
  }

  // Sort questions by accuracy (lowest first - most problematic)
  questionAnalytics.sort((a, b) => a.stats.accuracy - b.stats.accuracy);

  // Generate AI insights
  const aiInsights = await generateAIInsights(questionAnalytics, exam, {
    totalSubmissions,
    averageScore,
    scoreDistribution
  });

  res.status(200).json({
    message: "Exam analytics retrieved successfully",
    exam: {
      examId: exam.examId,
      examName: exam.examName,
      totalQuestions: exam.totalQuestions,
      duration: exam.duration,
      liveDate: exam.liveDate,
      deadDate: exam.deadDate,
    },
    analytics: {
      overallStats: {
        totalSubmissions,
        averageScore,
        scoreDistribution,
      },
      questionAnalytics,
      aiInsights,
      submissions: submissions.map(sub => ({
        studentName: sub.studentId.name,
        studentEmail: sub.studentId.email,
        score: sub.percentage,
        correctAnswers: sub.correctAnswers,
        totalTimeSpent: sub.totalTimeSpent,
        submittedAt: sub.submittedAt,
      }))
    }
  });
});

export {
  submitExam,
  getStudentResult,
  getAllStudentResults,
  getExamSubmissions,
  getAllExamsOverview,
  getExamAnalytics
};