import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  LinearProgress,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  useTheme,
  Skeleton,
  Alert,
  Stack,
  Divider,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  useMediaQuery,
  Card,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  Quiz as QuizIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  ArrowBack as ArrowBackIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useGetStudentResultQuery } from 'src/slices/submissionApiSlice';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const confetti = keyframes`
  0% { transform: rotate(0deg) translateX(0); }
  100% { transform: rotate(360deg) translateX(20px); }
`;

const StudentResultsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: resultData, isLoading, error } = useGetStudentResultQuery(examId, {
    skip: !examId
  });

  // Add these console logs right after the above line:
  console.log('API call details:');
  console.log('- examId being sent to API:', examId);
  console.log('- isLoading:', isLoading);
  console.log('- error:', error);
  console.log('- resultData:', resultData);

  const [animationDelay, setAnimationDelay] = useState(0);

  useEffect(() => {
    setAnimationDelay(0.1);
  }, []);
  
  useEffect(() => {
    console.log('examId from URL:', examId);
  }, [examId]);

  useEffect(() => {
    if (!isLoading && resultData !== undefined) {
      console.log('Fetched resultData:', resultData);
    }
  }, [isLoading, resultData]);


  if (isLoading) {
    return (
      <PageContainer title="Exam Results" description="Your exam results">
        <DashboardCard title="Loading Results...">
          <Stack spacing={3}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Stack>
        </DashboardCard>
      </PageContainer>
    );
  }

  if (error || !resultData) {
    return (
      <PageContainer title="Exam Results" description="Your exam results">
        <DashboardCard title="Results Not Found">
          <Alert 
            severity="error" 
            sx={{ borderRadius: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => navigate('/dashboard')}
                startIcon={<ArrowBackIcon />}
              >
                Go Back
              </Button>
            }
          >
            <Typography variant="h6" gutterBottom>Unable to Load Results</Typography>
            <Typography>
              We couldn't find your exam results. This might be because you haven't taken this exam yet or there was an error loading the data.
            </Typography>
          </Alert>
        </DashboardCard>
      </PageContainer>
    );
  }

  const { submission, exam } = resultData;
  const { percentage, correctAnswers, incorrectAnswers, totalQuestions, totalTimeSpent, answers } = submission;

  // Calculate grade
  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'success', emoji: '🏆' };
    if (percentage >= 80) return { grade: 'A', color: 'success', emoji: '🌟' };
    if (percentage >= 70) return { grade: 'B', color: 'info', emoji: '👍' };
    if (percentage >= 60) return { grade: 'C', color: 'warning', emoji: '👌' };
    if (percentage >= 50) return { grade: 'D', color: 'warning', emoji: '😐' };
    return { grade: 'F', color: 'error', emoji: '😔' };
  };

  const gradeInfo = getGrade(percentage);

  // Pie chart data
  const pieData = [
    { name: 'Correct', value: correctAnswers, color: theme.palette.success.main },
    { name: 'Incorrect', value: incorrectAnswers, color: theme.palette.error.main },
    { name: 'Unanswered', value: submission.unansweredQuestions || 0, color: theme.palette.grey[400] },
  ];

  // Time analysis data
  const timeData = answers.map((answer, index) => ({
    question: `Q${index + 1}`,
    time: answer.timeSpent,
    correct: answer.isCorrect,
  }));

  // Statistics Cards Component
  const StatsCard = ({ title, value, subtitle, icon, color = 'primary', animation = false }) => (
    <Card
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 3,
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(135deg, ${theme.palette[color].dark}20, ${theme.palette[color].main}10)`
          : `linear-gradient(135deg, ${theme.palette[color].light}20, ${theme.palette[color].main}10)`,
        border: `1px solid ${theme.palette[color].main}30`,
        transition: 'all 0.3s ease',
        animation: `${fadeIn} 0.6s ease-out ${animationDelay * 0.1}s both`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            backgroundColor: theme.palette[color].main,
            color: theme.palette[color].contrastText,
            width: 56,
            height: 56,
            animation: animation ? `${pulse} 2s infinite` : 'none',
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );

  return (
    <PageContainer title="Exam Results" description="Your exam results">
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.primary.dark}08, ${theme.palette.secondary.dark}08)`
            : `linear-gradient(135deg, ${theme.palette.primary.main}05, ${theme.palette.secondary.main}05)`,
          minHeight: '100vh',
          borderRadius: 4,
          p: { xs: 2, md: 4 },
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
              p: 2,
              borderRadius: 3,
              backgroundColor: 'background.paper',
              boxShadow: theme.shadows[4],
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <SchoolIcon 
                sx={{ 
                  fontSize: 40, 
                  color: theme.palette.primary.main,
                  animation: percentage >= 70 ? `${confetti} 3s infinite` : 'none',
                }} 
              />
              {percentage >= 70 && (
                <TrophyIcon
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    fontSize: 20,
                    color: theme.palette.warning.main,
                    animation: `${pulse} 1.5s infinite`,
                  }}
                />
              )}
            </Box>
            <Box>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {exam?.examName || 'Exam Results'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Score Overview Card */}
        <DashboardCard sx={{ mb: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold',
                color: theme.palette[gradeInfo.color].main,
                textShadow: `0 2px 4px ${theme.palette[gradeInfo.color].main}30`,
                mb: 1,
              }}
            >
              {percentage}%
            </Typography>
            <Chip 
              label={`Grade: ${gradeInfo.grade} ${gradeInfo.emoji}`}
              color={gradeInfo.color}
              size="large"
              sx={{ 
                fontSize: '1.1rem',
                fontWeight: 'bold',
                px: 2,
                py: 1,
                mb: 2,
              }}
            />
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  background: `linear-gradient(90deg, ${theme.palette[gradeInfo.color].light}, ${theme.palette[gradeInfo.color].main})`,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {correctAnswers} out of {totalQuestions} questions answered correctly
            </Typography>
          </Box>
        </DashboardCard>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Total Score"
              value={`${correctAnswers}/${totalQuestions}`}
              subtitle={`${percentage}% achieved`}
              icon={<AssessmentIcon />}
              color="primary"
              animation={true}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Correct Answers"
              value={correctAnswers}
              subtitle={`${Math.round((correctAnswers/totalQuestions)*100)}% accuracy`}
              icon={<CheckCircleIcon />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Incorrect Answers"
              value={incorrectAnswers}
              subtitle={`${Math.round((incorrectAnswers/totalQuestions)*100)}% of total`}
              icon={<CancelIcon />}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Time Spent"
              value={`${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`}
              subtitle="Total duration"
              icon={<AccessTimeIcon />}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <DashboardCard title="Performance Breakdown" sx={{ borderRadius: 3, height: '100%' }}>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardCard title="Time Per Question" sx={{ borderRadius: 3, height: '100%' }}>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="question" />
                    <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value, name) => [`${value}s`, 'Time Spent']}
                      labelFormatter={(label) => `Question ${label.slice(1)}`}
                    />
                    <Bar 
                      dataKey="time" 
                      fill={(data) => data.correct ? theme.palette.success.main : theme.palette.error.main}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Detailed Question Review */}
        <DashboardCard title="Question by Question Review" sx={{ borderRadius: 3 }}>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.grey[50] }}>Question</TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.grey[50] }}>Your Answer</TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.grey[50] }}>Correct Answer</TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.grey[50] }}>Result</TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.grey[50] }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {answers.map((answer, index) => (
                  <TableRow key={index} sx={{ '&:hover': { backgroundColor: theme.palette.grey[50] } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Question {index + 1}
                      </Typography>
                      {answer.questionId?.question && (
                        <Typography variant="caption" color="text.secondary">
                          {answer.questionId.question.substring(0, 50)}...
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={answer.studentAnswer || 'Not Answered'}
                        size="small"
                        color={answer.isCorrect ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={answer.correctAnswer}
                        size="small"
                        color="success"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      {answer.isCorrect ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {answer.timeSpent}s
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DashboardCard>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ borderRadius: 2 }}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="contained"
            startIcon={<TimelineIcon />}
            onClick={() => navigate('/student/results/all')}
            sx={{ borderRadius: 2 }}
          >
            View All Results
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default StudentResultsPage;