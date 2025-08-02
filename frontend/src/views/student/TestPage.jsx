import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, CircularProgress } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import MultipleChoiceQuestion from './Components/MultipleChoiceQuestion';
import NumberOfQuestions from './Components/NumberOfQuestions';
import WebCam from './Components/WebCam';
import { useGetExamsQuery, useGetQuestionsQuery } from '../../slices/examApiSlice';
import { useSaveCheatingLogMutation } from 'src/slices/cheatingLogApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const TestPage = () => {
  const { examId, testId } = useParams();

  const [selectedExam, setSelectedExam] = useState([]);
  const [examDurationInSeconds, setexamDurationInSeconds] = useState(0);
  const { data: userExamdata } = useGetExamsQuery();

  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0); // optional if per-question time not tracked

  useEffect(() => {
    if (userExamdata) {
      const exam = userExamdata.filter((exam) => {
        return exam.examId === examId;
      });
      setSelectedExam(exam);
      setexamDurationInSeconds(exam[0].duration * 60);
    }
  }, [userExamdata]);

  const [questions, setQuestions] = useState([]);
  const { data, isLoading } = useGetQuestionsQuery(examId);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const [saveCheatingLogMutation] = useSaveCheatingLogMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [cheatingLog, setCheatingLog] = useState({
    noFaceCount: 0,
    multipleFaceCount: 0,
    cellPhoneCount: 0,
    ProhibitedObjectCount: 0,
    examId: examId,
    username: '',
    email: '',
  });

  const submitExamResult = async () => {
    // Don't calculate here - let backend handle it
    const submissionData = {
      examId,
      answers: submittedAnswers,
      totalTimeSpent: totalTimeSpent,
    };
    console.log("Submitting data:", submissionData); // Add this line

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      };
      await axios.post("/api/submissions", submissionData, config);
      toast.success("Exam submitted successfully");
    } catch (error) {
      console.error("Submission error:", error);
      console.error("Error response:", error.response?.data); // Add this line
      const errorMessage = error.response?.data?.message || "Failed to submit exam result";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (data) {
      setQuestions(data);
    }
  }, [data]);

  // Fixed answer update handler
  const handleAnswerUpdate = (answerObj) => {
    setSubmittedAnswers((prev) => {
      // Find if answer for this question already exists
      const existingIndex = prev.findIndex(a => a.questionId === answerObj.questionId);
      
      if (existingIndex >= 0) {
        // Update existing answer
        const updated = [...prev];
        updated[existingIndex] = answerObj;
        return updated;
      } else {
        // Add new answer
        return [...prev, answerObj];
      }
    });
  };

  const handleTestSubmission = async () => {
    try {
      setCheatingLog((prevLog) => ({
        ...prevLog,
        username: userInfo.name,
        email: userInfo.email,
      }));

      await saveCheatingLog(cheatingLog);

      await saveCheatingLogMutation(cheatingLog).unwrap();

      await submitExamResult(); // 👉 submit the answers to backend

      toast.success("User logs and results saved!");

      navigate(`/Success`);
    } catch (error) {
      console.log('cheatlog: ', error);
    }
  };

  const saveUserTestScore = () => {
    setScore(score + 1);
  };

  const saveCheatingLog = async (cheatingLog) => {
    console.log(cheatingLog);
  };

  return (
    <PageContainer title="TestPage" description="This is TestPage">
      <Box pt="3rem">
        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={7}>
            <BlankCard>
              <Box
                width="100%"
                minHeight="400px"
                boxShadow={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <MultipleChoiceQuestion 
                    questions={data} 
                    saveUserTestScore={saveUserTestScore} 
                    onAnswerUpdate={handleAnswerUpdate}
                  />
                )}
              </Box>
            </BlankCard>
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <BlankCard>
                  <Box
                    maxHeight="300px"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      justifyContent: 'center',
                      overflowY: 'auto',
                      height: '100%',
                    }}
                  >
                    <NumberOfQuestions
                      questionLength={questions.length}
                      submitTest={handleTestSubmission}
                      examDurationInSeconds={examDurationInSeconds}
                    />
                  </Box>
                </BlankCard>
              </Grid>
              <Grid item xs={12}>
                <BlankCard>
                  <Box
                    width="300px"
                    maxHeight="180px"
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    justifyContent="center"
                  >
                    <WebCam cheatingLog={cheatingLog} updateCheatingLog={setCheatingLog} />
                  </Box>
                </BlankCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default TestPage;