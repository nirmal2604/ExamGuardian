import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Fade,
  Divider,
  InputAdornment,
  Stack,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Assessment,
  Security,
  Speed,
  SmartToy,
  Schedule,
  People,
  TrendingUp,
  Visibility,
  CalendarToday,
  AccessTime,
  QuestionMark,
  Title,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Stats data
const platformStats = [
  { label: 'Exams Created', value: '500+', color: '#3b82f6' },
  { label: 'Success Rate', value: '98%', color: '#10b981' },
  { label: 'Monitoring', value: '24/7', color: '#f59e0b' },
  { label: 'Students', value: '10K+', color: '#8b5cf6' },
];

// Platform features data
const platformFeatures = [
  {
    icon: SmartToy,
    title: 'AI Proctoring',
    description: 'Real-time monitoring with advanced AI detection',
    color: '#3b82f6',
  },
  {
    icon: Assessment,
    title: 'Analytics',
    description: 'Comprehensive reporting and insights',
    color: '#10b981',
  },
  {
    icon: Security,
    title: 'Security',
    description: 'Bank-level encryption and protection',
    color: '#f59e0b',
  },
  {
    icon: Speed,
    title: 'Performance',
    description: 'Lightning-fast and scalable platform',
    color: '#ef4444',
  },
];

// Validation schema
const validationSchema = Yup.object({
  examName: Yup.string().required('Exam name is required'),
  totalQuestions: Yup.number()
    .required('Total number of questions is required')
    .min(1, 'Must have at least 1 question'),
  examDuration: Yup.number()
    .required('Exam duration is required')
    .min(1, 'Duration must be at least 1 minute'),
  liveDateTime: Yup.string().required('Live date and time is required'),
  deadDateTime: Yup.string().required('Dead date and time is required'),
});

// Memoized components moved outside to prevent re-renders
const StatsCard = memo(({ stat, index, isDark }) => (
  <Fade in timeout={600 + index * 100}>
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha(
          stat.color,
          0.1
        )} 0%, ${alpha(stat.color, 0.05)} 100%)`,
        border: `1px solid ${alpha(
          stat.color,
          isDark ? 0.3 : 0.2
        )}`,
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${alpha(
            stat.color,
            isDark ? 0.25 : 0.15
          )}`,
          border: `1px solid ${alpha(
            stat.color,
            isDark ? 0.4 : 0.3
          )}`,
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: stat.color,
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          {stat.value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        >
          {stat.label}
        </Typography>
      </CardContent>
    </Card>
  </Fade>
));

// Improved FeatureCard Component
const FeatureCard = memo(({ feature, index, isDark }) => {
  const IconComponent = feature.icon;
  return (
    <Fade in timeout={800 + index * 150}>
      <Card
        sx={{
          background: isDark 
            ? 'linear-gradient(135deg, #334155 0%, #475569 100%)'
            : '#ffffff',
          border: `1px solid ${isDark ? '#64748b' : '#e0e0e0'}`,
          borderRadius: 3,
          height: '100%',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            background: isDark 
              ? `linear-gradient(135deg, ${alpha(feature.color, 0.15)} 0%, ${alpha(feature.color, 0.08)} 100%)`
              : `linear-gradient(135deg, ${alpha(feature.color, 0.02)} 0%, ${alpha(feature.color, 0.05)} 100%)`, // Light mode hover background
            boxShadow: isDark
              ? `0 12px 32px ${alpha(feature.color, 0.4)}, 0 0 0 1px ${alpha(feature.color, 0.3)}`
              : `0 12px 32px ${alpha(feature.color, 0.15)}, 0 0 0 1px ${alpha(feature.color, 0.2)}`, // Light mode hover shadow
            border: `1px solid ${alpha(feature.color, isDark ? 0.6 : 0.4)}`,
            '& .feature-icon': {
              bgcolor: alpha(feature.color, isDark ? 0.4 : 0.15), // More prominent in light mode
              color: isDark ? '#ffffff' : feature.color,
              boxShadow: isDark 
                ? `0 4px 12px ${alpha(feature.color, 0.3)}`
                : `0 4px 12px ${alpha(feature.color, 0.2)}`, // Light mode icon shadow
            },
          },
        }}
      >
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              className="feature-icon"
              sx={{
                bgcolor: alpha(feature.color, isDark ? 0.3 : 0.1),
                color: isDark ? '#ffffff' : feature.color,
                mr: 2,
                width: 48,
                height: 48,
                border: isDark ? `2px solid ${alpha(feature.color, 0.4)}` : 'none',
              }}
            >
              <IconComponent />
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: isDark ? '#f8fafc' : 'text.primary',
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}
            >
              {feature.title}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: isDark ? '#cbd5e1' : 'text.secondary',
              lineHeight: 1.6,
              flexGrow: 1,
            }}
          >
            {feature.description}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );
});


const FormField = memo(({ 
  name, 
  label, 
  type = 'text', 
  icon: Icon, 
  placeholder, 
  multiline = false, 
  rows = 1,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  focusedField,
  isDark
}) => {
  return (
    <TextField
      fullWidth
      name={name}
      label={label}
      type={type}
      placeholder={placeholder}
      multiline={multiline}
      rows={rows}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: Icon && (
          <InputAdornment position="start">
            <Icon
              sx={{
                color: focusedField === name 
                  ? (isDark ? '#5D87FF' : '#1976d2')
                  : (isDark ? '#94a3b8' : 'text.secondary'),
              }}
            />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiInputLabel-root': {
          color: isDark ? '#cbd5e1' : undefined,
          fontSize: '1rem', // Larger label text
          fontWeight: 500, // Medium weight for better visibility
          '&.Mui-focused': {
            color: isDark ? '#5D87FF' : '#1976d2',
          },
          '&.MuiInputLabel-shrink': {
            fontSize: '0.875rem', // Slightly smaller when shrunk but still readable
          },
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: isDark ? '#334155' : '#fff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? '#64748b' : undefined,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? '#94a3b8' : alpha('#1976d2', 0.5),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? '#5D87FF' : '#1976d2',
            borderWidth: 2,
          },
          '& input': {
            color: isDark ? '#f8fafc' : undefined,
          },
          '& textarea': {
            color: isDark ? '#f8fafc' : undefined,
          },
        },
        '& .MuiFormHelperText-root': {
          color: isDark ? '#94a3b8' : undefined,
          '&.Mui-error': {
            color: isDark ? '#FA896B' : undefined,
          },
        },
      }}
    />
  );
});

const CreateExamPage = memo(({ onSubmit, loading = false }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = useCallback((values) => {
    onSubmit?.(values);
  }, [onSubmit]);

  const formik = useFormik({
    initialValues: {
      examName: '',
      totalQuestions: '',
      examDuration: '',
      liveDateTime: '',
      deadDateTime: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleFieldFocus = useCallback((fieldName) => {
    setFocusedField(fieldName);
  }, []);

  const handleFormReset = useCallback(() => {
    formik.resetForm();
    setFocusedField(null);
  }, [formik]);

  // Stable references for memoized components
  const statsCards = useMemo(() => 
    platformStats.map((stat, idx) => (
      <Grid item xs={6} sm={3} key={stat.label}>
        <StatsCard stat={stat} index={idx} isDark={isDark} />
      </Grid>
    )), [isDark]
  );

  const featureCards = useMemo(() => 
    platformFeatures.map((feature, idx) => (
      <Grid item xs={12} sm={6} lg={12} key={feature.title}>
        <FeatureCard feature={feature} index={idx} isDark={isDark} />
      </Grid>
    )), [isDark]
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark
          ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(
              theme.palette.background.paper,
              0.05
            )} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(
              theme.palette.background.paper,
              1
            )} 50%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container 
        maxWidth={false} 
        sx={{ 
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          maxWidth: '1600px',
          mx: 'auto'
        }}
      >
        {/* Header Section */}
        <Fade in timeout={400}>
          <Box sx={{ mb: { xs: 3, sm: 4, md: 6 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: '#ffffff',
                  mr: 2,
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                }}
              >
                <Assessment />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                    mb: 0.5,
                  }}
                >
                  Create New Exam
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  Configure comprehensive exams with advanced proctoring
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
              {statsCards}
            </Grid>
          </Box>
        </Fade>

        {/* Main Grid */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Features Column */}
          <Grid item xs={12} lg={4} xl={5}>
            <Fade in timeout={600}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  background: isDark ? theme.palette.background.paper : '#ffffff',
                  border: `1px solid ${theme.palette.divider}`,
                  height: 'fit-content',
                  boxShadow: isDark
                    ? `0 4px 20px ${alpha('#000', 0.3)}`
                    : `0 4px 20px ${alpha('#000', 0.08)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: isDark 
                        ? theme.palette.primary.main 
                        : alpha(theme.palette.primary.main, 0.1),
                      color: isDark ? '#ffffff' : theme.palette.primary.main,
                      mr: 2,
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Speed />
                  </Avatar>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    }}
                  >
                    Platform Features
                  </Typography>
                </Box>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {featureCards}
                </Grid>
              </Paper>
            </Fade>
          </Grid>

          {/* Exam Form Column */}
          <Grid item xs={12} lg={8} xl={7}>
            <Fade in timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  background: isDark ? theme.palette.background.paper : '#ffffff',
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: isDark
                    ? `0 4px 20px ${alpha('#000', 0.3)}`
                    : `0 4px 20px ${alpha('#000', 0.08)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: isDark 
                        ? theme.palette.secondary.main 
                        : alpha(theme.palette.secondary.main, 0.1),
                      color: isDark ? '#ffffff' : theme.palette.secondary.main,
                      mr: 2,
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Assessment />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        mb: 0.5,
                      }}
                    >
                      Exam Configuration
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      }}
                    >
                      Setup your examination parameters and scheduling
                    </Typography>
                  </Box>
                </Box>
                {loading && (
                  <LinearProgress
                    sx={{
                      mb: 3,
                      borderRadius: 1,
                      height: 3,
                    }}
                  />
                )}
                <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={{ xs: 2.5, sm: 3 }}>
                    <FormField
                      name="examName"
                      label="Exam Name"
                      icon={Title}
                      placeholder="Enter exam name"
                      value={formik.values.examName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      onFocus={() => handleFieldFocus('examName')}
                      error={formik.touched.examName && Boolean(formik.errors.examName)}
                      helperText={formik.touched.examName && formik.errors.examName}
                      focusedField={focusedField}
                      isDark={isDark}
                    />
                    <Grid container spacing={{ xs: 2, sm: 3 }}>  
                      <Grid item xs={12} sm={6}>
                        <FormField
                          name="totalQuestions"
                          label="Total Number of Questions"
                          type="number"
                          icon={QuestionMark}
                          placeholder="e.g., 50"
                          value={formik.values.totalQuestions}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          onFocus={() => handleFieldFocus('totalQuestions')}
                          error={formik.touched.totalQuestions && Boolean(formik.errors.totalQuestions)}
                          helperText={formik.touched.totalQuestions && formik.errors.totalQuestions}
                          focusedField={focusedField}
                          isDark={isDark}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          name="examDuration"
                          label="Exam Duration (minutes)"
                          type="number"
                          icon={AccessTime}
                          placeholder="e.g., 120"
                          value={formik.values.examDuration}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          onFocus={() => handleFieldFocus('examDuration')}
                          error={formik.touched.examDuration && Boolean(formik.errors.examDuration)}
                          helperText={formik.touched.examDuration && formik.errors.examDuration}
                          focusedField={focusedField}
                          isDark={isDark}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          name="liveDateTime"
                          label="Live Date and Time"
                          type="datetime-local"
                          icon={CalendarToday}
                          value={formik.values.liveDateTime}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          onFocus={() => handleFieldFocus('liveDateTime')}
                          error={formik.touched.liveDateTime && Boolean(formik.errors.liveDateTime)}
                          helperText={formik.touched.liveDateTime && formik.errors.liveDateTime}
                          focusedField={focusedField}
                          isDark={isDark}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          name="deadDateTime"
                          label="Dead Date and Time"
                          type="datetime-local"
                          icon={Schedule}
                          value={formik.values.deadDateTime}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          onFocus={() => handleFieldFocus('deadDateTime')}
                          error={formik.touched.deadDateTime && Boolean(formik.errors.deadDateTime)}
                          helperText={formik.touched.deadDateTime && formik.errors.deadDateTime}
                          focusedField={focusedField}
                          isDark={isDark}
                        />
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading || !formik.isValid}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          textTransform: 'none',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          color: '#ffffff',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                          },
                          '&:disabled': {
                            background: theme.palette.action.disabledBackground,
                            color: theme.palette.action.disabled,
                          },
                        }}
                      >
                        {loading ? 'Creating Exam...' : 'Create Exam'}
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleFormReset}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          textTransform: 'none',
                          borderWidth: 2,
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          backgroundColor: 'transparent',
                          '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-1px)',
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        Reset Form
                      </Button>
                    </Box>
                  </Stack>
                </form>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default CreateExamPage;