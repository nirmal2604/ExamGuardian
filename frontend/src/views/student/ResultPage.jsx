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
import PageContainer from 'src/components/container/PageContainer';
import { useGetExamsQuery, useGetQuestionsQuery } from 'src/slices/examApiSlice';
import { keyframes } from '@emotion/react';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const ResultPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';
  
  // Get user info from Redux store
  const { userInfo } = useSelector((state) => state.auth);
  
  // State management
  const [selectedExamId, setSelectedExamId] = useState('');
  const [mockResults, setMockResults] = useState(null);
  
  // API calls
  const { data: examsData, isLoading: examsLoading, error: examsError } = useGetExamsQuery();
  const { data: questionsData, isLoading: questionsLoading, error: questionsError } = useGetQuestionsQuery(selectedExamId, {
    skip: !selectedExamId
  });

  // Set default exam when data loads
  useEffect(() => {
    if (examsData && examsData.length > 0 && !selectedExamId) {
      setSelectedExamId(examsData[0].examId);
    }
  }, [examsData, selectedExamId]);

  // Generate mock results when exam and questions are selected
  useEffect(() => {
    if (selectedExamId && questionsData && questionsData.length > 0) {
      generateMockResults();
    }
  }, [selectedExamId, questionsData]);

  const generateMockResults = () => {
    if (!questionsData || questionsData.length === 0) return;

    // Generate realistic mock results
    const totalQuestions = questionsData.length;
    const correctAnswers = Math.floor(Math.random() * (totalQuestions - Math.floor(totalQuestions * 0.3))) + Math.floor(totalQuestions * 0.3);
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    const resultsWithAnswers = questionsData.map((question, index) => {
      const isCorrect = index < correctAnswers;
      const correctOption = question.options.find(opt => opt.isCorrect);
      const incorrectOptions = question.options.filter(opt => !opt.isCorrect);
      
      return {
        id: question._id,
        question: question.question,
        studentAnswer: isCorrect ? correctOption?.optionText : incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)]?.optionText,
        correctAnswer: correctOption?.optionText,
        isCorrect: isCorrect,
        options: question.options.map(opt => opt.optionText)
      };
    });

    const selectedExam = examsData?.find(exam => exam.examId === selectedExamId);
    
    setMockResults({
      score: correctAnswers,
      totalQuestions: totalQuestions,
      percentage: percentage,
      timeTaken: Math.floor(Math.random() * (selectedExam?.duration || 30)) + Math.floor((selectedExam?.duration || 30) * 0.5),
      examName: selectedExam?.examName || 'Sample Exam',
      examDuration: selectedExam?.duration || 30,
      examDate: new Date().toLocaleDateString(),
      questions: resultsWithAnswers
    });
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return { 
      message: "Outstanding Performance! 🏆", 
      color: "success", 
      icon: <TrophyIcon />,
      bgColor: theme.palette.success.light + '20'
    };
    if (percentage >= 80) return { 
      message: "Excellent Work! 🎉", 
      color: "success", 
      icon: <CheckCircleIcon />,
      bgColor: theme.palette.success.light + '20'
    };
    if (percentage >= 70) return { 
      message: "Good Job! 👍", 
      color: "info", 
      icon: <TrendingUpIcon />,
      bgColor: theme.palette.info.light + '20'
    };
    if (percentage >= 60) return { 
      message: "Fair Performance 📚", 
      color: "warning", 
      icon: <AssessmentIcon />,
      bgColor: theme.palette.warning.light + '20'
    };
    return { 
      message: "Needs Improvement 💪", 
      color: "error", 
      icon: <CancelIcon />,
      bgColor: theme.palette.error.light + '20'
    };
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Loading state
  if (examsLoading) {
    return (
      <PageContainer title="Exam Results" description="Loading exam results">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </PageContainer>
    );
  }

  // Error state
  if (examsError) {
    return (
      <PageContainer title="Exam Results" description="Error loading results">
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mt: 4 }}>
            Failed to load exam data. Please try again later.
          </Alert>
        </Container>
      </PageContainer>
    );
  }

  // No exams available
  if (!examsData || examsData.length === 0) {
    return (
      <PageContainer title="Exam Results" description="No exam results available">
        <Container maxWidth="md">
          <Alert severity="info" sx={{ mt: 4 }}>
            No exams available. Please contact your instructor.
          </Alert>
        </Container>
      </PageContainer>
    );
  }

  const performanceData = mockResults ? getPerformanceMessage(mockResults.percentage) : null;
  const correctCount = mockResults?.questions?.filter(q => q.isCorrect).length || 0;
  const incorrectCount = (mockResults?.questions?.length || 0) - correctCount;

  return (
    <PageContainer title="Exam Results" description="View your exam performance and detailed results">
      <Box
        sx={{
          minHeight: '100vh',
          background: isDark
            ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.light}08 0%, ${theme.palette.secondary.light}08 100%)`,
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box
            sx={{
              textAlign: 'center',
              mb: 4,
              animation: `${fadeIn} 0.6s ease-out`,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: performanceData?.color === 'success' ? 'success.main' : 
                        performanceData?.color === 'warning' ? 'warning.main' : 
                        performanceData?.color === 'error' ? 'error.main' : 'info.main',
                fontSize: '2rem',
                animation: `${scaleIn} 0.8s ease-out`,
              }}
            >
              {performanceData?.icon || <AssessmentIcon />}
            </Avatar>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              Exam Results
            </Typography>
            {performanceData && (
              <Typography
                variant="h5"
                sx={{
                  color: performanceData.color === 'success' ? 'success.main' : 
                         performanceData.color === 'warning' ? 'warning.main' : 
                         performanceData.color === 'error' ? 'error.main' : 'info.main',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                {performanceData.message}
              </Typography>
            )}
          </Box>

          {/* Exam Selection */}
          <Card
            elevation={3}
            sx={{
              mb: 4,
              borderRadius: 3,
              animation: `${slideIn} 0.8s ease-out`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <QuizIcon color="primary" />
                Select Exam to View Results
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Choose Exam</InputLabel>
                <Select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  label="Choose Exam"
                >
                  {examsData?.map((exam) => (
                    <MenuItem key={exam.examId} value={exam.examId}>
                      {exam.examName} - {new Date(exam.liveDate).toLocaleDateString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {questionsLoading && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          )}

          {mockResults && (
            <>
              {/* Summary Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Student Info Card */}
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={4}
                    sx={{
                      borderRadius: 3,
                      background: performanceData?.bgColor || theme.palette.background.paper,
                      animation: `${slideIn} 1s ease-out`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            mr: 2,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            Student Information
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Personal Details
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Name:</Typography>
                          <Typography variant="body2" fontWeight={600}>{userInfo?.name || 'Student'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Email:</Typography>
                          <Typography variant="body2" fontWeight={600}>{userInfo?.email || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Role:</Typography>
                          <Chip 
                            label={userInfo?.role || 'Student'} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Exam Info Card */}
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={4}
                    sx={{
                      borderRadius: 3,
                      background: performanceData?.bgColor || theme.palette.background.paper,
                      animation: `${slideIn} 1.2s ease-out`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'secondary.main',
                            mr: 2,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <SchoolIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            Exam Information
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Test Details
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Exam:</Typography>
                          <Typography variant="body2" fontWeight={600}>{mockResults.examName}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Date:</Typography>
                          <Typography variant="body2" fontWeight={600}>{mockResults.examDate}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Duration:</Typography>
                          <Typography variant="body2" fontWeight={600}>{mockResults.examDuration} minutes</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Time Taken:</Typography>
                          <Typography variant="body2" fontWeight={600}>{mockResults.timeTaken} minutes</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Score Summary */}
              <Card
                elevation={6}
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${performanceData?.bgColor || theme.palette.background.paper}, ${theme.palette.background.paper})`,
                  animation: `${fadeIn} 1.4s ease-out`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Box textAlign="center">
                        <Typography variant="h2" fontWeight={700} color="primary.main">
                          {mockResults.score}/{mockResults.totalQuestions}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Final Score
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box textAlign="center">
                        <Typography variant="h2" fontWeight={700} 
                          sx={{ 
                            color: performanceData?.color === 'success' ? 'success.main' : 
                                   performanceData?.color === 'warning' ? 'warning.main' : 
                                   performanceData?.color === 'error' ? 'error.main' : 'info.main'
                          }}
                        >
                          {mockResults.percentage}%
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Percentage
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={mockResults.percentage}
                          sx={{
                            mt: 2,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              backgroundColor: performanceData?.color === 'success' ? 'success.main' : 
                                             performanceData?.color === 'warning' ? 'warning.main' : 
                                             performanceData?.color === 'error' ? 'error.main' : 'info.main'
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon color="success" />
                            <Typography variant="body1">Correct</Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={600} color="success.main">
                            {correctCount}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CancelIcon color="error" />
                            <Typography variant="body1">Incorrect</Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={600} color="error.main">
                            {incorrectCount}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimeIcon color="info" />
                            <Typography variant="body1">Time Used</Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={600} color="info.main">
                            {mockResults.timeTaken}m
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Detailed Results Table */}
              <Card
                elevation={4}
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  animation: `${fadeIn} 1.6s ease-out`,
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="h5" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssessmentIcon color="primary" />
                      Detailed Question Analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Review your answers and see the correct solutions
                    </Typography>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: isDark ? theme.palette.grey[800] : theme.palette.grey[50] }}>
                          <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Question</TableCell>
                          {!isMobile && <TableCell sx={{ fontWeight: 600 }}>Your Answer</TableCell>}
                          {!isMobile && <TableCell sx={{ fontWeight: 600 }}>Correct Answer</TableCell>}
                          <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Result</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockResults.questions.map((question, index) => (
                          <TableRow
                            key={question.id}
                            sx={{
                              '&:hover': {
                                backgroundColor: isDark ? theme.palette.grey[800] : theme.palette.grey[50],
                              },
                              backgroundColor: question.isCorrect 
                                ? `${theme.palette.success.main}08`
                                : `${theme.palette.error.main}08`
                            }}
                          >
                            <TableCell sx={{ fontWeight: 600 }}>
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ maxWidth: isMobile ? 200 : 400 }}>
                                {question.question}
                              </Typography>
                              {isMobile && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Your answer: <strong>{question.studentAnswer}</strong>
                                  </Typography>
                                  <br />
                                  <Typography variant="caption" color="text.secondary">
                                    Correct: <strong>{question.correctAnswer}</strong>
                                  </Typography>
                                </Box>
                              )}
                            </TableCell>
                            {!isMobile && (
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: question.isCorrect ? 'success.main' : 'error.main',
                                    fontWeight: 500
                                  }}
                                >
                                  {question.studentAnswer}
                                </Typography>
                              </TableCell>
                            )}
                            {!isMobile && (
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                                  {question.correctAnswer}
                                </Typography>
                              </TableCell>
                            )}
                            <TableCell align="center">
                              <Chip
                                icon={question.isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                                label={question.isCorrect ? 'Correct' : 'Wrong'}
                                color={question.isCorrect ? 'success' : 'error'}
                                size="small"
                                variant={question.isCorrect ? 'filled' : 'outlined'}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              {/* Back to Dashboard Button */}
              <Box
                sx={{
                  textAlign: 'center',
                  animation: `${fadeIn} 1.8s ease-out`,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={handleBackToDashboard}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Back to Dashboard
                </Button>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </PageContainer>
  );
};

export default ResultPage;