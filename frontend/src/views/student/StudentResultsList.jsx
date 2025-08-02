import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  Skeleton,
  Alert,
  Stack,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';

import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useGetAllStudentResultsQuery } from 'src/slices/submissionApiSlice';

// Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StudentResultsList = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: resultsData, isLoading, error } = useGetAllStudentResultsQuery();

  // Calculate grade
  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'success', emoji: '🏆' };
    if (percentage >= 80) return { grade: 'A', color: 'success', emoji: '🌟' };
    if (percentage >= 70) return { grade: 'B', color: 'info', emoji: '👍' };
    if (percentage >= 60) return { grade: 'C', color: 'warning', emoji: '👌' };
    if (percentage >= 50) return { grade: 'D', color: 'warning', emoji: '😐' };
    return { grade: 'F', color: 'error', emoji: '😔' };
  };

  if (isLoading) {
    return (
      <PageContainer title="All Results" description="Your exam results history">
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Exam Results
          </Typography>
        </Box>

        <DashboardCard>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} md={6} lg={4} key={i}>
                <Skeleton 
                  variant="rectangular" 
                  height={180} 
                  sx={{ borderRadius: 2 }} 
                  animation="wave"
                />
              </Grid>
            ))}
          </Grid>
        </DashboardCard>
      </PageContainer>
    );
  }

  if (error || !resultsData) {
    return (
      <PageContainer title="All Results" description="Your exam results history">
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <DashboardCard>
          <Alert 
            severity="error" 
            sx={{ borderRadius: 2 }}
          >
            <Typography variant="h6" gutterBottom>Unable to Load Results</Typography>
            <Typography>
              We couldn't fetch your exam results. Please try again later.
            </Typography>
          </Alert>
        </DashboardCard>
      </PageContainer>
    );
  }

  const results = resultsData || [];

  return (
    <PageContainer title="All Results" description="Your exam results history">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            Back to Dashboard
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: theme.palette.primary.main,
                width: 48,
                height: 48,
              }}
            >
              <AssessmentIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Your Exam Results
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {results.length} exam{results.length !== 1 ? 's' : ''} completed
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Results Grid */}
        {results.length === 0 ? (
          <DashboardCard sx={{ borderRadius: 3 }}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <SchoolIcon 
                sx={{ 
                  fontSize: 80, 
                  color: theme.palette.grey[400], 
                  mb: 2 
                }} 
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Results Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You haven't taken any exams yet. Start your first exam to see results here!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{ borderRadius: 2 }}
              >
                Browse Exams
              </Button>
            </Box>
          </DashboardCard>
        ) : (
          <Grid container spacing={3}>
            {results.map((result, index) => {
              const gradeInfo = getGrade(result.submission.percentage);
              
              return (
                <Grid item xs={12} sm={6} lg={4} key={result.submission._id}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      animation: `${fadeIn} 0.5s ease-out ${index * 0.1}s both`,
                      cursor: 'pointer',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                        border: `1px solid ${theme.palette.primary.main}`,
                      },
                    }}
                    onClick={() => navigate(`/exam/${result.exam.examId}/result`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Exam Name */}
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '3em',
                        }}
                      >
                        {result.exam.examName}
                      </Typography>

                      {/* Date */}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {new Date(result.submission.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>

                      {/* Score Section */}
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: theme.palette[gradeInfo.color].main,
                            mb: 1,
                          }}
                        >
                          {result.submission.percentage}%
                        </Typography>
                        
                        <Chip 
                          label={`${gradeInfo.grade} ${gradeInfo.emoji}`}
                          color={gradeInfo.color}
                          size="small"
                          sx={{ fontWeight: 'bold', mb: 2 }}
                        />

                        <LinearProgress
                          variant="determinate"
                          value={result.submission.percentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              backgroundColor: theme.palette[gradeInfo.color].main,
                            },
                          }}
                        />
                      </Box>

                      {/* Quick Stats */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <CheckCircleIcon fontSize="small" color="success" />
                            <Typography variant="body2" fontWeight="600">
                              {result.submission.correctAnswers}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Correct
                          </Typography>
                        </Box>
                        
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <CancelIcon fontSize="small" color="error" />
                            <Typography variant="body2" fontWeight="600">
                              {result.submission.incorrectAnswers}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Wrong
                          </Typography>
                        </Box>
                        
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight="600">
                              {Math.floor(result.submission.totalTimeSpent / 60)}m
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Time
                          </Typography>
                        </Box>
                      </Box>

                      {/* Summary */}
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                        {result.submission.correctAnswers} of {result.submission.totalQuestions} questions correct
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </PageContainer>
  );
};

export default StudentResultsList;