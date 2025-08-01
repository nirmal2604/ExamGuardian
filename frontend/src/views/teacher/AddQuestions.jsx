import React from 'react';
import { Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import AddQuestionForm from './components/AddQuestionForm';

const AddQuestions = () => {
  return (
    <PageContainer 
      title="Question Builder - Add Questions" 
      description="Create and manage exam questions with our intuitive question builder interface"
    >
      {/* Remove the extra card wrapper to let the form component handle its own layout */}
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <AddQuestionForm />
      </Box>
    </PageContainer>
  );
};

export default AddQuestions;