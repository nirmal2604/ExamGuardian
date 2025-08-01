import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Select,
  MenuItem,
  Container,
  Card,
  Grid,
  Chip,
  InputAdornment,
  Avatar,
  useTheme,
  Skeleton,
  Alert,
  Stack,
  Divider,
  Badge,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Block as BlockIcon,
  Face as FaceIcon,
  Groups as GroupsIcon,
  Assessment as AssessmentIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useGetExamsQuery } from 'src/slices/examApiSlice';
import { useGetCheatingLogsQuery } from 'src/slices/cheatingLogApiSlice';
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

export default function CheatingTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [filter, setFilter] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [cheatingLogs, setCheatingLogs] = useState([]);

  const { data: examsData, isLoading: examsLoading } = useGetExamsQuery();
  const { data: cheatingLogsData, isLoading: logsLoading } = useGetCheatingLogsQuery(selectedExamId, {
    skip: !selectedExamId
  });

  useEffect(() => {
    if (examsData && examsData.length > 0 && !selectedExamId) {
      setSelectedExamId(examsData[0].examId);
    }
  }, [examsData, selectedExamId]);

  useEffect(() => {
    if (cheatingLogsData) {
      setCheatingLogs(cheatingLogsData);
    }
  }, [cheatingLogsData]);

  const filteredUsers = cheatingLogs.filter(
    (log) =>
      log.username.toLowerCase().includes(filter.toLowerCase()) ||
      log.email.toLowerCase().includes(filter.toLowerCase()),
  );

  const getSeverityColor = (count) => {
    if (count === 0) return 'success';
    if (count <= 2) return 'warning';
    return 'error';
  };

  const getSeverityIcon = (type, count) => {
    const iconProps = { fontSize: 'small', sx: { mr: 0.5 } };
    
    switch (type) {
      case 'noFace':
        return <FaceIcon {...iconProps} />;
      case 'multipleFace':
        return <GroupsIcon {...iconProps} />;
      case 'cellPhone':
        return <PhoneIcon {...iconProps} />;
      case 'prohibited':
        return <BlockIcon {...iconProps} />;
      default:
        return <WarningIcon {...iconProps} />;
    }
  };

  const totalViolations = filteredUsers.reduce((total, log) => 
    total + log.noFaceCount + log.multipleFaceCount + log.cellPhoneCount + log.prohibitedObjectCount, 0
  );

  const highRiskUsers = filteredUsers.filter(log => 
    (log.noFaceCount + log.multipleFaceCount + log.cellPhoneCount + log.prohibitedObjectCount) > 5
  ).length;

  // Statistics Cards
  const StatsCard = ({ title, value, icon, color = 'primary' }) => (
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
        <Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
    </Card>
  );

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
            <SecurityIcon 
              sx={{ 
                fontSize: 40, 
                color: theme.palette.error.main,
                animation: `${pulse} 2s infinite` 
              }} 
            />
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h1"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Exam Security Monitor
            </Typography>
          </Box>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Monitor and analyze suspicious activities during examinations
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Total Participants"
              value={filteredUsers.length}
              icon={<PersonIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Total Violations"
              value={totalViolations}
              icon={<WarningIcon />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="High Risk Users"
              value={highRiskUsers}
              icon={<SecurityIcon />}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Clean Records"
              value={filteredUsers.filter(log => 
                (log.noFaceCount + log.multipleFaceCount + log.cellPhoneCount + log.prohibitedObjectCount) === 0
              ).length}
              icon={<AssessmentIcon />}
              color="success"
            />
          </Grid>
        </Grid>

        {/* Main Content Card */}
        <Card
          elevation={6}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Controls Header */}
          <Box
            sx={{
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.grey[800]}, ${theme.palette.grey[700]})`
                : `linear-gradient(135deg, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
              p: 3,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FilterListIcon color="primary" />
                  Exam Selection
                </Typography>
                {examsLoading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                ) : (
                  <Select
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    fullWidth
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.divider,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <Typography color="text.secondary">Select an exam to view logs</Typography>
                    </MenuItem>
                    {examsData?.map((exam) => (
                      <MenuItem key={exam.examId} value={exam.examId}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <AssessmentIcon color="primary" fontSize="small" />
                          <Typography>{exam.examName}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SearchIcon color="primary" />
                  Search Filter
                </Typography>
                <TextField
                  placeholder="Search by name or email..."
                  variant="outlined"
                  fullWidth
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                      '& fieldset': {
                        borderColor: theme.palette.divider,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Table Content */}
          <Box sx={{ p: 3 }}>
            {!selectedExamId ? (
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%',
                    textAlign: 'center'
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>No Exam Selected</Typography>
                <Typography>Please select an exam from the dropdown above to view security logs.</Typography>
              </Alert>
            ) : logsLoading ? (
              <Stack spacing={2}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
                ))}
              </Stack>
            ) : filteredUsers.length === 0 ? (
              <Alert 
                severity="success" 
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%',
                    textAlign: 'center'
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>No Security Issues Found</Typography>
                <Typography>
                  {cheatingLogs.length === 0 
                    ? "No participants found for this exam or no security logs recorded."
                    : "All participants have clean security records. No violations detected!"
                  }
                </Typography>
              </Alert>
            ) : (
              <TableContainer 
                component={Paper} 
                elevation={0}
                sx={{ 
                  borderRadius: 3, 
                  border: `1px solid ${theme.palette.divider}`,
                  maxHeight: 600,
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
                        fontWeight: 700,
                        color: 'text.primary'
                      }}>
                        #
                      </TableCell>
                      <TableCell sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
                        fontWeight: 700,
                        color: 'text.primary'
                      }}>
                        Participant
                      </TableCell>
                      {!isMobile && (
                        <TableCell sx={{ 
                          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
                          fontWeight: 700,
                          color: 'text.primary'
                        }}>
                          Email
                        </TableCell>
                      )}
                      <TableCell sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
                        fontWeight: 700,
                        color: 'text.primary',
                        textAlign: 'center'
                      }}>
                        No Face
                      </TableCell>
                      <TableCell sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
                        fontWeight: 700,
                        color: 'text.primary',
                        textAlign: 'center'
                      }}>
                        Multiple Face
                      </TableCell>
                      <TableCell sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
                        fontWeight: 700,
                        color: 'text.primary',
                        textAlign: 'center'
                      }}>
                        Phone
                      </TableCell>
                      <TableCell sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
                        fontWeight: 700,
                        color: 'text.primary',
                        textAlign: 'center'
                      }}>
                        Prohibited
                      </TableCell>
                      <TableCell sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
                        fontWeight: 700,
                        color: 'text.primary',
                        textAlign: 'center'
                      }}>
                        Risk Level
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((log, index) => {
                      const totalViolationsForUser = log.noFaceCount + log.multipleFaceCount + log.cellPhoneCount + log.prohibitedObjectCount;
                      const riskLevel = totalViolationsForUser === 0 ? 'low' : totalViolationsForUser <= 3 ? 'medium' : 'high';
                      const riskColor = riskLevel === 'low' ? 'success' : riskLevel === 'medium' ? 'warning' : 'error';
                      
                      return (
                        <TableRow 
                          key={index}
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? theme.palette.grey[800] 
                                : theme.palette.grey[50],
                            },
                            animation: `${fadeIn} 0.3s ease-in-out ${index * 0.1}s both`,
                          }}
                        >
                          <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar 
                                sx={{ 
                                  backgroundColor: theme.palette.primary.main,
                                  width: 32,
                                  height: 32,
                                  fontSize: '0.875rem'
                                }}
                              >
                                {log.username.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                  {log.username}
                                </Typography>
                                {isMobile && (
                                  <Typography variant="caption" color="text.secondary">
                                    {log.email}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {log.email}
                              </Typography>
                            </TableCell>
                          )}
                          <TableCell align="center">
                            <Chip
                              icon={getSeverityIcon('noFace', log.noFaceCount)}
                              label={log.noFaceCount}
                              color={getSeverityColor(log.noFaceCount)}
                              size="small"
                              variant={log.noFaceCount === 0 ? "outlined" : "filled"}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={getSeverityIcon('multipleFace', log.multipleFaceCount)}
                              label={log.multipleFaceCount}
                              color={getSeverityColor(log.multipleFaceCount)}
                              size="small"
                              variant={log.multipleFaceCount === 0 ? "outlined" : "filled"}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={getSeverityIcon('cellPhone', log.cellPhoneCount)}
                              label={log.cellPhoneCount}
                              color={getSeverityColor(log.cellPhoneCount)}
                              size="small"
                              variant={log.cellPhoneCount === 0 ? "outlined" : "filled"}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={getSeverityIcon('prohibited', log.prohibitedObjectCount)}
                              label={log.prohibitedObjectCount}
                              color={getSeverityColor(log.prohibitedObjectCount)}
                              size="small"
                              variant={log.prohibitedObjectCount === 0 ? "outlined" : "filled"}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={riskLevel.toUpperCase()}
                              color={riskColor}
                              size="small"
                              sx={{ 
                                fontWeight: 'bold',
                                minWidth: 80
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Card>
      </Box>
    </Container>
  );
}