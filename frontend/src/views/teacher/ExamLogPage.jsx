import React from 'react';
import { Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import CheatingTable from './components/CheatingTable';

const ExamLogPage = () => {
  return (
    <PageContainer 
      title="Exam Security Monitor - Security Logs" 
      description="Monitor and analyze suspicious activities and security violations during examinations"
    >
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <CheatingTable />
      </Box>
    </PageContainer>
  );
};

export default ExamLogPage;