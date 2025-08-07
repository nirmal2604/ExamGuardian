import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const ExamSubmissionsList = ({ submissions, examData }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return theme.palette.success.main;
    if (percentage >= 75) return theme.palette.info.main;
    if (percentage >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreLabel = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    return 'Poor';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTimeSpent = (seconds) => {
    if (seconds === 0 || !seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (!submissions || submissions.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Submissions Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Students haven't submitted their responses for this exam yet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const paginatedSubmissions = submissions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {submissions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Submissions
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {Math.round(submissions.reduce((acc, sub) => acc + sub.percentage, 0) / submissions.length)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Score
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {submissions.filter(sub => sub.percentage >= 75).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Above 75%
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Submissions Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell align="center">Score</TableCell>
              <TableCell align="center">Correct/Total</TableCell>
              <TableCell align="center">Time Spent</TableCell>
              <TableCell align="center">Submitted At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSubmissions.map((submission) => (
              <TableRow key={submission._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                      {submission.studentId.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {submission.studentId.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {submission.studentId.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`${submission.percentage}%`}
                      sx={{
                        backgroundColor: getScoreColor(submission.percentage),
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: 60,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {getScoreLabel(submission.percentage)}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {submission.correctAnswers}/{submission.totalQuestions}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(submission.correctAnswers / submission.totalQuestions) * 100}
                      sx={{ width: 50, height: 4, borderRadius: 2 }}
                    />
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <Typography variant="body2">
                    {formatTimeSpent(submission.totalTimeSpent)}
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  <Typography variant="body2">
                    {formatDate(submission.submittedAt)}
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <TablePagination
          component="div"
          count={submissions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  );
};

export default ExamSubmissionsList;