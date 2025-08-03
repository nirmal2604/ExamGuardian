import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Select,
  MenuItem,
  Typography,
  Card,
  Paper,
  Chip,
  Divider,
  useTheme,
  Fade,
  Grow,
  Slide,
  Grid,
  Container,
  IconButton,
  Collapse,
  Badge,
  Skeleton,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Quiz as QuizIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  School as SchoolIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import swal from 'sweetalert';
import { 
  useCreateQuestionMutation, 
  useGetExamsQuery,
  useGetQuestionsQuery
} from 'src/slices/examApiSlice';
import { toast } from 'react-toastify';
import { keyframes } from '@emotion/react';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideInFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const AddQuestionForm = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // States
  const [newlyAddedQuestions, setNewlyAddedQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctOptions, setCorrectOptions] = useState([false, false, false, false]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [showExistingQuestions, setShowExistingQuestions] = useState(true);
  const [showNewQuestions, setShowNewQuestions] = useState(true);

  // API hooks
  const [createQuestion, { isLoading }] = useCreateQuestionMutation();
  const { data: examsData, isLoading: examsLoading } = useGetExamsQuery();
  const {
    data: existingQuestions = [],
    isLoading: questionsLoading,
    refetch: refetchQuestions
  } = useGetQuestionsQuery(selectedExamId, {
    skip: !selectedExamId
  });

  useEffect(() => {
    if (examsData && examsData.length > 0 && !selectedExamId) {
      setSelectedExamId(examsData[0].examId);
    }
  }, [examsData, selectedExamId]);

  // Reset newly added questions when exam changes
  useEffect(() => {
    setNewlyAddedQuestions([]);
  }, [selectedExamId]);

  const handleOptionChange = (index) => {
    const updatedCorrectOptions = [...correctOptions];
    updatedCorrectOptions[index] = !correctOptions[index];
    setCorrectOptions(updatedCorrectOptions);
  };

  // OPTIMIZED: No unnecessary refetch on every question add
  const handleAddQuestion = async () => {
    if (newQuestion.trim() === '' || newOptions.some((option) => option.trim() === '')) {
      swal('', 'Please fill out the question and all options.', 'error');
      return;
    }

    if (!correctOptions.some(option => option)) {
      swal('', 'Please mark at least one correct answer.', 'error');
      return;
    }

    const newQuestionObj = {
      question: newQuestion,
      options: newOptions.map((option, index) => ({
        optionText: option,
        isCorrect: correctOptions[index],
      })),
      examId: selectedExamId,
    };

    try {
      const res = await createQuestion(newQuestionObj).unwrap();
      if (res) {
        toast.success('Question added successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        
        // Add to newly added questions (creates smooth animation for new questions only)
        setNewlyAddedQuestions([...newlyAddedQuestions, res]);
        
        // Clear form
        setNewQuestion('');
        setNewOptions(['', '', '', '']);
        setCorrectOptions([false, false, false, false]);
        
        // REMOVED: refetchQuestions() - This was causing the reload effect!
        // Only refetch when necessary (like session completion or exam change)
      }
    } catch (err) {
      swal('', 'Failed to create question. Please try again.', 'error');
    }
  };

  // OPTIMIZED: Refetch only when session is completed
  const handleSubmitQuestions = async () => {
    setNewlyAddedQuestions([]);
    setNewQuestion('');
    setNewOptions(['', '', '', '']);
    setCorrectOptions([false, false, false, false]);
    
    // Refetch to sync newly added questions with existing questions
    if (selectedExamId) {
      await refetchQuestions();
    }
    
    toast.info('Session completed! All questions have been saved.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  // OPTIMIZED: QuestionCard with stable animations
  const QuestionCard = ({ question, isNew = false, index }) => (
    <Grow 
      in={true} 
      timeout={isNew ? 300 + index * 100 : 0}  // Only animate new questions
      key={isNew ? `new-${index}` : `existing-${question.id || index}`}
    >
      <Card
        elevation={isNew ? 4 : 2}
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isNew 
            ? isDark
              ? '#2d3748'
              : `linear-gradient(135deg, ${theme.palette.primary.light}10, ${theme.palette.secondary.light}10)`
            : isDark
              ? '#1a202c'
              : 'background.paper',
          border: isNew 
            ? `2px solid ${theme.palette.primary.main}30`
            : isDark
              ? '1px solid #4a5568'
              : `1px solid ${theme.palette.divider}`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
          '&::before': isNew ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          } : {},
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Box
              sx={{
                minWidth: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: isNew 
                  ? theme.palette.primary.main 
                  : isDark ? '#4299e1' : theme.palette.grey[400],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            >
              {index + 1}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    color: isDark ? '#e2e8f0' : 'text.primary',
                    flex: 1 
                  }}
                >
                  {question.question}
                </Typography>
                {isNew && (
                  <Chip 
                    label="New" 
                    size="small" 
                    color="primary"
                    sx={{ 
                      fontWeight: 600,
                      animation: `${pulseAnimation} 2s infinite`
                    }}
                  />
                )}
              </Box>
              
              <Grid container spacing={1} sx={{ mt: 2 }}>
                {question.options.map((option, optionIndex) => (
                  <Grid item xs={12} sm={6} key={optionIndex}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: option.isCorrect
                          ? isDark
                            ? '#2d5a3d'
                            : `${theme.palette.success.main}15`
                          : isDark
                            ? '#2d3748'
                            : `${theme.palette.grey[100]}`,
                        border: `1px solid ${
                          option.isCorrect 
                            ? theme.palette.success.main 
                            : isDark ? '#4a5568' : theme.palette.grey[300]
                        }`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          backgroundColor: option.isCorrect 
                            ? theme.palette.success.main 
                            : isDark ? '#4299e1' : theme.palette.grey[400],
                          color: 'white',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          flex: 1,
                          color: isDark ? '#cbd5e1' : 'text.primary',
                        }}
                      >
                        {option.optionText}
                      </Typography>
                      {option.isCorrect && (
                        <CheckCircleIcon 
                          sx={{ 
                            color: theme.palette.success.main, 
                            fontSize: 18 
                          }} 
                        />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Card>
    </Grow>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          background: isDark
            ? '#1a1b23'
            : `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
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
              backgroundColor: isDark ? '#2a2d3a' : 'background.paper',
              boxShadow: theme.shadows[4],
              border: isDark ? '1px solid #4a5568' : `1px solid ${theme.palette.divider}`,
              animation: `${floatAnimation} 3s ease-in-out infinite`,
            }}
          >
            <SchoolIcon 
              sx={{ 
                fontSize: 40, 
                color: theme.palette.primary.main,
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
              Question Builder
            </Typography>
          </Box>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              color: isDark ? '#a0aec0' : 'text.secondary',
            }}
          >
            Create engaging questions and manage your exam content with ease
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Panel - Form */}
          <Grid item xs={12} lg={5}>
            <Card
              elevation={6}
              sx={{
                position: 'sticky',
                top: 20,
                borderRadius: 4,
                overflow: 'hidden',
                background: isDark ? '#2d3748' : 'background.paper',
                backdropFilter: 'blur(20px)',
                border: isDark ? '1px solid #4a5568' : 'none',
              }}
            >
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  p: 3,
                  color: 'white',
                }}
              >
                <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AddIcon />
                  Add New Question
                </Typography>
              </Box>

              <Box sx={{ p: 4 }}>
                {/* Exam Selection */}
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="subtitle2" 
                    gutterBottom 
                    sx={{ 
                      color: isDark ? '#a0aec0' : 'text.secondary', 
                      fontWeight: 600 
                    }}
                  >
                    Select Exam
                  </Typography>
                  {examsLoading ? (
                    <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                  ) : (
                    <Select
                      value={selectedExamId}
                      onChange={(e) => setSelectedExamId(e.target.value)}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        backgroundColor: isDark ? '#1a202c' : 'background.paper',
                        color: isDark ? '#e2e8f0' : 'text.primary',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDark ? '#4a5568' : theme.palette.divider,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                        '& .MuiSelect-icon': {
                          color: isDark ? '#a0aec0' : 'inherit',
                        },
                      }}
                    >
                      {examsData?.map((exam) => (
                        <MenuItem key={exam.examId} value={exam.examId}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <QuizIcon color="primary" />
                            {exam.examName}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Box>

                {/* Question Input */}
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="subtitle2" 
                    gutterBottom 
                    sx={{ 
                      color: isDark ? '#a0aec0' : 'text.secondary', 
                      fontWeight: 600 
                    }}
                  >
                    Question Text
                  </Typography>
                  <TextField
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter your question here..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: isDark ? '#1a202c' : 'background.paper',
                        color: isDark ? '#e2e8f0' : 'text.primary',
                        '& fieldset': {
                          borderColor: isDark ? '#4a5568' : theme.palette.divider,
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                        '& textarea': {
                          color: isDark ? '#e2e8f0' : 'text.primary',
                        },
                        '& textarea::placeholder': {
                          color: isDark ? '#a0aec0' : 'text.secondary',
                          opacity: 0.8,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: isDark ? '#a0aec0' : 'text.secondary',
                      },
                    }}
                  />
                </Box>

                {/* Options */}
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="subtitle2" 
                    gutterBottom 
                    sx={{ 
                      color: isDark ? '#a0aec0' : 'text.secondary', 
                      fontWeight: 600 
                    }}
                  >
                    Answer Options
                  </Typography>
                  <Stack spacing={2}>
                    {newOptions.map((option, index) => (
                      <Slide direction="up" in={true} key={index} timeout={200 + index * 100}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: correctOptions[index]
                              ? isDark
                                ? '#2d5a3d'
                                : `${theme.palette.success.main}10`
                              : isDark
                                ? '#374151'
                                : theme.palette.grey[50],
                            border: `2px solid ${
                              correctOptions[index] 
                                ? theme.palette.success.main 
                                : isDark ? '#4a5568' : theme.palette.divider
                            }`,
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Box
                            sx={{
                              minWidth: 30,
                              height: 30,
                              borderRadius: '50%',
                              backgroundColor: correctOptions[index] 
                                ? theme.palette.success.main 
                                : isDark
                                  ? '#4299e1'
                                  : theme.palette.grey[400],
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '0.8rem',
                            }}
                          >
                            {String.fromCharCode(65 + index)}
                          </Box>
                          <TextField
                            value={newOptions[index]}
                            onChange={(e) => {
                              const updatedOptions = [...newOptions];
                              updatedOptions[index] = e.target.value;
                              setNewOptions(updatedOptions);
                            }}
                            fullWidth
                            size="small"
                            placeholder={`Option ${index + 1}`}
                            sx={{ 
                              flex: 1,
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: isDark ? '#1a202c' : 'background.paper',
                                color: isDark ? '#e2e8f0' : 'text.primary',
                                '& fieldset': {
                                  borderColor: isDark ? '#4a5568' : theme.palette.divider,
                                },
                                '&:hover fieldset': {
                                  borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: theme.palette.primary.main,
                                },
                                '& input': {
                                  color: isDark ? '#e2e8f0' : 'text.primary',
                                },
                                '& input::placeholder': {
                                  color: isDark ? '#a0aec0' : 'text.secondary',
                                  opacity: 0.8,
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: isDark ? '#a0aec0' : 'text.secondary',
                              },
                            }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={correctOptions[index]}
                                onChange={() => handleOptionChange(index)}
                                color="success"
                                sx={{
                                  '& .MuiSvgIcon-root': {
                                    color: isDark ? '#a0aec0' : 'inherit',
                                  },
                                  '&.Mui-checked .MuiSvgIcon-root': {
                                    color: theme.palette.success.main,
                                  },
                                }}
                              />
                            }
                            label="Correct"
                            sx={{ 
                              m: 0,
                              '& .MuiFormControlLabel-label': {
                                color: isDark ? '#e2e8f0' : 'text.primary',
                                fontWeight: 500,
                              },
                            }}
                          />
                        </Box>
                      </Slide>
                    ))}
                  </Stack>
                </Box>

                {/* Action Buttons */}
                <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                  <Button
                    variant="contained"
                    onClick={handleAddQuestion}
                    disabled={isLoading}
                    startIcon={<AddIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      fontWeight: 600,
                      '&:hover': {
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    {isLoading ? 'Adding...' : 'Add Question'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={handleSubmitQuestions}
                    disabled={newlyAddedQuestions.length === 0}
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      borderColor: isDark ? '#4a5568' : theme.palette.primary.main,
                      color: isDark ? '#e2e8f0' : theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: isDark 
                          ? `${theme.palette.primary.main}20` 
                          : `${theme.palette.primary.main}10`,
                      },
                    }}
                  >
                    Complete Session
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>

          {/* Right Panel - Questions Display */}
          <Grid item xs={12} lg={7}>
            <Stack spacing={4}>
              {/* Existing Questions Section */}
              {selectedExamId && (
                <Card 
                  elevation={3} 
                  sx={{ 
                    borderRadius: 3, 
                    overflow: 'hidden',
                    background: isDark ? '#2f3349' : 'background.paper',
                    border: isDark ? '1px solid #4a5568' : 'none',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: isDark ? '#2f3349' : theme.palette.grey[50],
                      borderBottom: isDark ? '1px solid #4a5568' : `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      // Remove cursor and onClick from here
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PreviewIcon sx={{ color: isDark ? '#a0aec0' : 'action.active' }} />
                      <Typography 
                        variant="h6" 
                        fontWeight={600} 
                        sx={{ color: isDark ? '#e2e8f0' : 'text.primary' }}
                      >
                        Existing Questions
                      </Typography>
                      <Badge 
                        badgeContent={existingQuestions.length} 
                        color="primary"
                        sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}
                      />
                    </Box>
                    <IconButton 
                      sx={{ color: isDark ? '#e2e8f0' : 'text.primary' }}
                      onClick={() => setShowExistingQuestions(!showExistingQuestions)}  // Move onClick here
                    >
                      {showExistingQuestions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  
                  <Collapse in={showExistingQuestions}>
                    <Box sx={{ p: 3 }}>
                      {questionsLoading ? (
                        <Stack spacing={2}>
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                          ))}
                        </Stack>
                      ) : existingQuestions.length > 0 ? (
                        <Stack spacing={3}>
                          {existingQuestions.map((questionObj, index) => (
                            <QuestionCard 
                              key={questionObj.id || index} 
                              question={questionObj} 
                              index={index}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Box
                          sx={{
                            textAlign: 'center',
                            py: 6,
                            color: isDark ? '#718096' : 'text.secondary',
                          }}
                        >
                          <QuizIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                          <Typography variant="h6" gutterBottom>
                            No existing questions
                          </Typography>
                          <Typography variant="body2">
                            Start by adding your first question below
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Card>
              )}

              {/* Newly Added Questions Section */}
              {newlyAddedQuestions.length > 0 && (
                // <Fade in={true} timeout={500}>
                  <Card 
                    elevation={4} 
                    sx={{ 
                      borderRadius: 3, 
                      overflow: 'hidden',
                      background: isDark ? '#2d3748' : 'background.paper',
                      border: isDark ? '1px solid #4a5568' : 'none',
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        background: isDark
                          ? '#2563eb'
                          : `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                        borderBottom: isDark ? '1px solid #4a5568' : `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        // cursor: 'pointer',
                      }}
                      // onClick={() => setShowNewQuestions(!showNewQuestions)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AddIcon sx={{ color: isDark ? 'white' : theme.palette.primary.main }} />
                        <Typography 
                          variant="h6" 
                          fontWeight={600} 
                          sx={{ color: isDark ? 'white' : 'text.primary' }}
                        >
                          Newly Added Questions
                        </Typography>
                        <Badge 
                          badgeContent={newlyAddedQuestions.length} 
                          color="primary"
                          sx={{ 
                            '& .MuiBadge-badge': { 
                              fontWeight: 'bold',
                              backgroundColor: isDark ? 'white' : theme.palette.primary.main,
                              color: isDark ? theme.palette.primary.main : 'white',
                              animation: `${pulseAnimation} 2s infinite`,
                            } 
                          }}
                        />
                      </Box>
                       <IconButton 
                      sx={{ color: isDark ? 'white' : 'text.primary' }}
                      onClick={() => setShowNewQuestions(!showNewQuestions)}  // Move onClick here
                    >
                      {showNewQuestions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    </Box>
                    
                    <Collapse in={showNewQuestions}>
                      <Box sx={{ p: 3 }}>
                        <Stack spacing={3}>
                          {newlyAddedQuestions.map((questionObj, index) => (
                            <QuestionCard 
                              key={`new-${index}`} 
                              question={questionObj} 
                              isNew={true}
                              index={index}
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Collapse>
                  </Card>
                // </Fade>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AddQuestionForm;