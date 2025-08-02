import mongoose from "mongoose";

const submissionSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    examId: {
      type: String, // Using string to match your examId field in examModel
      required: true,
      ref: "Exam",
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Question",
        },
        studentAnswer: {
          type: String,
          required: true,
        },
        correctAnswer: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
        timeSpent: {
          type: Number, // Time in seconds
          default: 0,
        },
      },
    ],
    // Overall submission stats
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    incorrectAnswers: {
      type: Number,
      required: true,
    },
    unansweredQuestions: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    totalTimeSpent: {
      type: Number, // Total time in seconds
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    // Status to track if exam was completed normally or had issues
    status: {
      type: String,
      enum: ["completed", "timeout", "terminated"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
submissionSchema.index({ studentId: 1, examId: 1 });
submissionSchema.index({ examId: 1 });
submissionSchema.index({ studentId: 1 });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;