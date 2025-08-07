import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Alert,
  Skeleton,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

import PageContainer from 'src/components/container/PageContainer';
import { useGetExamSubmissionsQuery, useGetExamAnalyticsQuery } from 'src/slices/submissionApiSlice';

// Import your existing components or create new ones
import ExamSubmissionsList from './components/ExamSubmissions';
import ExamAnalytics from './components/ExamAnalytics';

const ExamDetailedView = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const { 
    data: submissionsData, 
    isLoading: submissionsLoading, 
    error: submissionsError 
  } = useGetExamSubmissionsQuery(examId);

  const { 
    data: analyticsData, 
    isLoading: analyticsLoading, 
    error: analyticsError 
  } = useGetExamAnalyticsQuery(examId);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (submissionsLoading || analyticsLoading) {
    return (
      <PageContainer title="Exam Details" description="Detailed exam analysis">
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/teacher/exams/overview')}
            sx={{ mb: 2 }}
          >
            Back to Exams
          </Button>
          <Skeleton variant="text" width="300px" height={40} />
          <Skeleton variant="text" width="200px" height={24} />
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Skeleton variant="rectangular" height={200} />
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (submissionsError || analyticsError || !submissionsData || !analyticsData) {
    return (
      <PageContainer title="Exam Details" description="Detailed exam analysis">
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/teacher/exams/overview')}
            sx={{ mb: 2 }}
          >
            Back to Exams
          </Button>
        </Box>

        <Alert severity="error">
          <Typography variant="h6" gutterBottom>Unable to Load Exam Details</Typography>
          <Typography>
            We couldn't fetch the exam details. Please try again later.
          </Typography>
        </Alert>
      </PageContainer>
    );
  }

  const exam = submissionsData.exam || analyticsData.exam;
  const submissions = submissionsData.submissions || [];

  return (
    <PageContainer title={exam.examName} description="Detailed exam analysis and student submissions">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/teacher/exams/overview')}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            Back to Exams
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                {exam.examName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {submissions.length} student{submissions.length !== 1 ? 's' : ''} attempted
              </Typography>
            </Box>
          </Box>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Card sx={{ flex: 1, minWidth: 120 }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {exam.totalQuestions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Questions
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ flex: 1, minWidth: 120 }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  {submissions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submissions
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ flex: 1, minWidth: 120 }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" color="info.main" fontWeight="bold">
                  {exam.duration}m
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab 
                icon={<PeopleIcon />} 
                label={`Submissions (${submissions.length})`}
                iconPosition="start"
              />
              <Tab 
                icon={<AnalyticsIcon />} 
                label="Analytics & Insights"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <CardContent>
            {tabValue === 0 && (
              <ExamSubmissionsList 
                submissions={submissions}
                examData={exam}
              />
            )}
            {tabValue === 1 && (
              <ExamAnalytics 
                analyticsData={analyticsData.analytics}
                examData={exam}
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default ExamDetailedView;