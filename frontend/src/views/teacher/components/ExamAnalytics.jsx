import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Container,
  Card,
  Grid,
  Chip,
  Avatar,
  useTheme,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Stack,
  useMediaQuery,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Timer as TimerIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  QuestionAnswer as QuestionIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { keyframes } from '@emotion/react';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const ExamAnalytics = ({ analyticsData = {}, examData = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // Color scheme
  const colors = {
    primary: theme.palette.primary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    secondary: theme.palette.secondary.main,
  };

  const pieColors = [colors.success, colors.warning, colors.error, colors.secondary];

  // Process data for charts with defensive checks
  const scoreDistributionData = analyticsData?.overallStats?.scoreDistribution
    ? Object.entries(analyticsData.overallStats.scoreDistribution).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value
      }))
    : [];

  const questionPerformanceData = analyticsData?.questionAnalytics?.map(q => ({
    question: q.question || 'Unknown',
    accuracy: q.stats?.accuracy || 0,
    attempts: q.stats?.totalAttempts || 0,
    avgTime: q.stats?.averageTimeSpent || 0
  })) || [];

  const timeSpentData = analyticsData?.questionAnalytics?.map(q => ({
    question: q.question || 'Unknown',
    time: q.stats?.averageTimeSpent || 0
  })) || [];

  // Get performance insights
  const getPerformanceInsight = (accuracy) => {
    if (accuracy >= 90) return { text: 'Excellent', color: 'success', icon: CheckCircleIcon };
    if (accuracy >= 70) return { text: 'Good', color: 'primary', icon: AssessmentIcon };
    if (accuracy >= 50) return { text: 'Average', color: 'warning', icon: WarningIcon };
    return { text: 'Needs Improvement', color: 'error', icon: ErrorIcon };
  };

  // Statistics Cards Component
  const StatsCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(135deg, ${theme.palette[color].dark}20, ${theme.palette[color].main}10)`
          : `linear-gradient(135deg, ${theme.palette[color].light}20, ${theme.palette[color].main}10)`,
        border: `1px solid ${theme.palette[color].main}30`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        animation: `${fadeIn} 0.6s ease-out`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            backgroundColor: theme.palette[color].main,
            color: theme.palette[color].contrastText,
            width: 56,
            height: 56,
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

  // Parse AI Insights
  const parseAIInsights = (insights) => {
    if (!insights) return [];
    return Object.entries(insights).map(([key, content]) => ({
      title: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      content
    }));
  };

  const aiInsightSections = parseAIInsights(analyticsData?.aiInsights);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            <AssessmentIcon 
              sx={{ 
                fontSize: 40, 
                color: theme.palette.primary.main,
                animation: `${pulse} 2s infinite` 
              }} 
            />
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h1"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Exam Analytics Dashboard
            </Typography>
          </Box>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Comprehensive analysis of {examData?.examName || 'Exam'} performance and insights
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Live: {examData?.liveDate ? new Date(examData.liveDate).toLocaleString() : 'N/A'} - 
            Deadline: {examData?.deadDate ? new Date(examData.deadDate).toLocaleString() : 'N/A'}
          </Typography>
        </Box>

        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Total Submissions"
              value={analyticsData?.overallStats?.totalSubmissions || 0}
              icon={<PeopleIcon />}
              color="primary"
              subtitle={`Out of ${examData?.totalQuestions || 0} questions`}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Average Score"
              value={`${analyticsData?.overallStats?.averageScore || 0}%`}
              icon={<TrendingUpIcon />}
              color="success"
              subtitle="Class performance"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Total Questions"
              value={examData?.totalQuestions || 0}
              icon={<QuestionIcon />}
              color="info"
              subtitle={`${examData?.duration || 0} minutes duration`}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Exam Duration"
              value={`${examData?.duration || 0}m`}
              icon={<TimerIcon />}
              color="warning"
              subtitle="Time allocated"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Score Distribution */}
          <Grid item xs={12} lg={6}>
            <Card
              elevation={6}
              sx={{
                borderRadius: 4,
                p: 3,
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssessmentIcon color="primary" />
                Score Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {scoreDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                {scoreDistributionData.map((entry, index) => (
                  <Chip
                    key={entry.name}
                    label={`${entry.name} (${entry.value})`}
                    sx={{
                      backgroundColor: pieColors[index % pieColors.length],
                      color: 'white',
                    }}
                    size="small"
                  />
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Question Performance */}
          <Grid item xs={12} lg={6}>
            <Card
              elevation={6}
              sx={{
                borderRadius: 4,
                p: 3,
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon color="primary" />
                Question Accuracy
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={questionPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="question" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
                    <Bar dataKey="accuracy" fill={colors.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Time Spent Chart */}
        <Card
          elevation={6}
          sx={{
            borderRadius: 4,
            p: 3,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimerIcon color="primary" />
            Average Time Spent per Question
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSpentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}s`, 'Time']} />
                <Line type="monotone" dataKey="time" stroke={colors.warning} strokeWidth={3} dot={{ fill: colors.warning, r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Question Analysis Table */}
        <Card
          elevation={6}
          sx={{
            borderRadius: 4,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <QuestionIcon color="primary" />
              Detailed Question Analysis
            </Typography>
          </Box>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50] }}>
                    Question
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50] }}>
                    Attempts
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50] }}>
                    Correct
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50] }}>
                    Accuracy
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50] }}>
                    Avg Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50] }}>
                    Performance
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50] }}>
                      Most Selected
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50] }}>
                      Correct Answer
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {(analyticsData?.questionAnalytics || []).map((question, index) => {
                  const insight = getPerformanceInsight(question?.stats?.accuracy || 0);
                  const IconComponent = insight.icon;
                  const mostSelected = question?.stats?.answerDistribution
                    ? Object.entries(question.stats.answerDistribution)[0] || ['N/A', 0]
                    : ['N/A', 0];
                  const correctAnswer = question?.options?.find(opt => opt.isCorrect)?.optionText || 'N/A';
                  
                  return (
                    <TableRow 
                      key={question?.questionId || index} 
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
                        },
                        animation: `${fadeIn} 0.3s ease-in-out ${index * 0.1}s both`,
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {question?.question || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {question?.stats?.totalAttempts || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {question?.stats?.correctAttempts || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={question?.stats?.accuracy || 0}
                            sx={{ flex: 1, height: 8, borderRadius: 4 }}
                            color={insight.color}
                          />
                          <Typography variant="body2" fontWeight={600}>
                            {question?.stats?.accuracy || 0}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {question?.stats?.averageTimeSpent || 0}s
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<IconComponent />}
                          label={insight.text}
                          color={insight.color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            Option {mostSelected[0]} ({mostSelected[1]}×)
                          </Typography>
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell>
                          <Typography variant="body2" color="success.main">
                            Option {correctAnswer}
                          </Typography>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* AI Insights */}
        <Card
          elevation={6}
          sx={{
            borderRadius: 4,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.grey[800]}, ${theme.palette.grey[700]})`
                : `linear-gradient(135deg, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PsychologyIcon color="primary" />
              AI-Generated Insights & Recommendations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Automated analysis and teaching recommendations based on exam performance
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              {aiInsightSections.map((section, index) => (
                <Box key={index}>
                  <Typography variant="h6" fontWeight={600} color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon />
                    {section.title}
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
                      borderRadius: 2 
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {section.content}
                    </Typography>
                  </Paper>
                  {index < aiInsightSections.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Stack>
          </Box>
        </Card>

        {/* Student Submissions */}
        <Card
          elevation={6}
          sx={{
            borderRadius: 4,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.grey[800]}, ${theme.palette.grey[700]})`
                : `linear-gradient(135deg, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="primary" />
              Individual Student Performance
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {(analyticsData?.submissions || []).map((submission, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4],
                      },
                      animation: `${fadeIn} 0.3s ease-in-out ${index * 0.1}s both`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          backgroundColor: theme.palette.primary.main,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {submission?.studentName?.charAt(0)?.toUpperCase() || 'N/A'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {submission?.studentName || 'Unknown'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {submission?.studentEmail || 'N/A'}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${submission?.score || 0}%`}
                        color={submission?.score >= 80 ? 'success' : submission?.score >= 60 ? 'warning' : 'error'}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Correct Answers
                        </Typography>
                        <Typography variant="h6" color="success.main" fontWeight={600}>
                          {submission?.correctAnswers || 0}/{examData?.totalQuestions || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Submitted At
                        </Typography>
                        <Typography variant="body2">
                          {submission?.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Total Time Spent
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {submission?.totalTimeSpent || 0}s
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

// PropTypes for validation
ExamAnalytics.propTypes = {
  analyticsData: PropTypes.shape({
    overallStats: PropTypes.shape({
      totalSubmissions: PropTypes.number,
      averageScore: PropTypes.number,
      scoreDistribution: PropTypes.object
    }),
    questionAnalytics: PropTypes.arrayOf(
      PropTypes.shape({
        questionId: PropTypes.string,
        question: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            optionText: PropTypes.string,
            isCorrect: PropTypes.bool,
            _id: PropTypes.string
          })
        ),
        stats: PropTypes.shape({
          totalAttempts: PropTypes.number,
          correctAttempts: PropTypes.number,
          accuracy: PropTypes.number,
          averageTimeSpent: PropTypes.number,
          answerDistribution: PropTypes.object
        })
      })
    ),
    aiInsights: PropTypes.object,
    submissions: PropTypes.arrayOf(
      PropTypes.shape({
        studentName: PropTypes.string,
        studentEmail: PropTypes.string,
        score: PropTypes.number,
        correctAnswers: PropTypes.number,
        totalTimeSpent: PropTypes.number,
        submittedAt: PropTypes.string
      })
    )
  }),
  examData: PropTypes.shape({
    examId: PropTypes.string,
    examName: PropTypes.string,
    totalQuestions: PropTypes.number,
    duration: PropTypes.number,
    liveDate: PropTypes.string,
    deadDate: PropTypes.string
  })
};

// Default props to prevent undefined errors
ExamAnalytics.defaultProps = {
  analyticsData: {
    overallStats: {
      totalSubmissions: 0,
      averageScore: 0,
      scoreDistribution: {}
    },
    questionAnalytics: [],
    aiInsights: {},
    submissions: []
  },
  examData: {
    examId: '',
    examName: '',
    totalQuestions: 0,
    duration: 0,
    liveDate: '',
    deadDate: ''
  }
};

export default ExamAnalytics;