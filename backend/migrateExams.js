import mongoose from "mongoose";
import Exam from "./models/examModel.js";
import User from "./models/userModel.js";
import dotenv from "dotenv";
import path from "path";

// Load .env from parent directory (root folder)
dotenv.config({ path: path.resolve('../.env') });

const migrateExistingExams = async () => {

  console.log("MONGO_URL from env:", process.env.MONGO_URL ? "Found" : "Not found");
  console.log("All env keys:", Object.keys(process.env).filter(key => key.includes('MONGO')));
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Find the teacher account
    const teacher = await User.findOne({ email: "nirmalmodi2604@gmail.com" });
    
    if (!teacher) {
      console.error("Teacher not found with email: nirmalmodi2604@gmail.com");
      process.exit(1);
    }

    // Find exams without createdBy field
    const examsToUpdate = await Exam.find({ createdBy: { $exists: false } });
    
    console.log(`Found ${examsToUpdate.length} exams to migrate`);

    // Update each exam
    for (let exam of examsToUpdate) {
      await Exam.updateOne(
        { _id: exam._id },
        { createdBy: teacher._id }
      );
      console.log(`Updated exam: ${exam.examName}`);
    }

    console.log("Migration completed successfully!");
    process.exit(0);
    
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateExistingExams();