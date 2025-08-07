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
  Avatar,
  LinearProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Quiz as QuizIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';

import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useGetAllExamsOverviewQuery } from 'src/slices/submissionApiSlice';

// Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TeacherExamsOverview = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: examsData, isLoading, error } = useGetAllExamsOverviewQuery();

  // Get status color and text
  const getExamStatus = (liveDate, deadDate) => {
    const now = new Date();
    const start = new Date(liveDate);
    const end = new Date(deadDate);

    if (now < start) {
      return { status: 'Upcoming', color: 'info', bgColor: theme.palette.info.light };
    } else if (now >= start && now <= end) {
      return { status: 'Active', color: 'success', bgColor: theme.palette.success.light };
    } else {
      return { status: 'Ended', color: 'default', bgColor: theme.palette.grey[300] };
    }
  };

  // Get performance color
  const getPerformanceColor = (average) => {
    if (average >= 80) return 'success';
    if (average >= 60) return 'warning';
    return 'error';
  };

  if (isLoading) {
    return (
      <PageContainer title="My Exams" description="Overview of all your created exams">
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
            My Exams Overview
          </Typography>
        </Box>

        <DashboardCard>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} md={6} lg={4} key={i}>
                <Skeleton 
                  variant="rectangular" 
                  height={220} 
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

  if (error || !examsData) {
    return (
      <PageContainer title="My Exams" description="Overview of all your created exams">
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
            <Typography variant="h6" gutterBottom>Unable to Load Exams</Typography>
            <Typography>
              We couldn't fetch your exam overview. Please try again later.
            </Typography>
          </Alert>
        </DashboardCard>
      </PageContainer>
    );
  }

  const exams = examsData?.exams || [];

  return (
    <PageContainer title="My Exams" description="Overview of all your created exams">
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
                My Exams Overview
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {exams.length} exam{exams.length !== 1 ? 's' : ''} created
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Exams Grid */}
        {exams.length === 0 ? (
          <DashboardCard sx={{ borderRadius: 3 }}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <QuizIcon 
                sx={{ 
                  fontSize: 80, 
                  color: theme.palette.grey[400], 
                  mb: 2 
                }} 
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Exams Created Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first exam to see the overview here!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/create-exam')}
                sx={{ borderRadius: 2 }}
              >
                Create First Exam
              </Button>
            </Box>
          </DashboardCard>
        ) : (
          <Grid container spacing={3}>
            {exams.map((exam, index) => {
              const statusInfo = getExamStatus(exam.liveDate, exam.deadDate);
              const performanceColor = getPerformanceColor(exam.stats.averageScore);
              
              return (
                <Grid item xs={12} sm={6} lg={4} key={exam.examId}>
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
                    onClick={() => navigate(`/teacher/exam/${exam.examId}/details`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header with Status */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Chip 
                          label={statusInfo.status}
                          color={statusInfo.color}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          sx={{ minWidth: 'auto', p: 0.5 }}
                        >
                          View
                        </Button>
                      </Box>

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
                        {exam.examName}
                      </Typography>

                      {/* Exam Details */}
                      <Box sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <QuizIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {exam.totalQuestions} questions
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ScheduleIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {exam.duration}m
                            </Typography>
                          </Box>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Created: {new Date(exam.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>

                      {/* Stats Section */}
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Class Average
                          </Typography>
                          <Typography variant="h6" color={theme.palette[performanceColor].main} fontWeight="bold">
                            {exam.stats.averageScore}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={exam.stats.averageScore}
                          color={performanceColor}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>

                      {/* Quick Stats */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <PeopleIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight="600">
                              {exam.stats.totalSubmissions}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Students
                          </Typography>
                        </Box>
                        
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <TrendingUpIcon fontSize="small" color="success" />
                            <Typography variant="body2" fontWeight="600">
                              {exam.stats.highestScore}%
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Highest
                          </Typography>
                        </Box>
                        
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" fontWeight="600" color="error">
                            {exam.stats.lowestScore}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Lowest
                          </Typography>
                        </Box>
                      </Box>
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

export default TeacherExamsOverview;