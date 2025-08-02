import { apiSlice } from './apiSlice';

const SUBMISSIONS_URL = '/api/submissions';

export const submissionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Submit exam answers
    submitExam: builder.mutation({
      query: (data) => ({
        url: SUBMISSIONS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    
    // Get student result for a specific exam
    getStudentResult: builder.query({
      query: (examId) => ({
        url: `${SUBMISSIONS_URL}/${examId}`,
        method: 'GET',
      }),
    }),
    
    // Get all results for the logged-in student
    getAllStudentResults: builder.query({
      query: () => ({
        url: `${SUBMISSIONS_URL}/student/all`,
        method: 'GET',
      }),
    }),
    
    // Get all submissions for an exam (teachers only)
    getExamSubmissions: builder.query({
      query: (examId) => ({
        url: `${SUBMISSIONS_URL}/exam/${examId}/all`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useSubmitExamMutation,
  useGetStudentResultQuery,
  useGetAllStudentResultsQuery,
  useGetExamSubmissionsQuery,
} = submissionApiSlice;