import React from 'react';
import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

/* **Layouts*** */
import BlankLayout from '../layouts/blank/BlankLayout';
import FullLayout from '../layouts/full/FullLayout';
import ExamLayout from '../layouts/full/ExamLayout';

/* ***Pages**** */
import SamplePage from '../views/sample-page/SamplePage';
import Success from '../views/Success';

//Student Routes
import TestPage from './../views/student/TestPage';
import ExamPage from './../views/student/ExamPage';
import ExamDetails from './../views/student/ExamDetails';
import ResultPage from './../views/student/ResultPage';
import StudentResultsList from './../views/student/StudentResultsList';

//Auth Routes
import Error from '../views/authentication/Error';
import Register from '../views/authentication/Register';
import Login from '../views/authentication/Login';
import UserAccount from '../views/authentication/UserAccount';

// Teacher Routes
import CreateExamPage from './../views/teacher/CreateExamPage';
import ExamLogPage from './../views/teacher/ExamLogPage';
import AddQuestions from './../views/teacher/AddQuestions';
import PrivateRoute from 'src/views/authentication/PrivateRoute';
import TeacherRoute from 'src/views/authentication/TeacherRoute';
import TeacherExamsOverview from 'src/views/teacher/TeacherExamOverview';
import ExamDetailedView from 'src/views/teacher/ExamDetailedView';

const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        {/* Main layout */}
        <Route path="/" element={<FullLayout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<ExamPage />} />
          <Route path="exam" element={<Navigate to="/dashboard" replace />} />
          <Route path="sample-page" element={<SamplePage />} />
          <Route path="Success" element={<Success />} />
          <Route path="exam/:examId/result" element={<ResultPage />} />
          <Route path="student/results/all" element={<StudentResultsList />} />
          <Route path="" element={<TeacherRoute />}>
            <Route path="create-exam" element={<CreateExamPage />} />
            <Route path="add-questions" element={<AddQuestions />} />
            <Route path="exam-log" element={<ExamLogPage />} />
            <Route path="teacher/exams/overview" element={<TeacherExamsOverview />} />
            <Route path="teacher/exam/:examId/details" element={<ExamDetailedView />} />
          </Route>
        </Route>

        {/* Exam routes using ExamLayout */}
        <Route path="exam/:examId" element={<ExamLayout />}>
          <Route index element={<ExamDetails />} />
          <Route path=":testId" element={<TestPage />} />
        </Route>
      </Route>

      {/* User layout */}
      <Route path="user" element={<FullLayout />}>
        <Route path="account" element={<UserAccount />} />
      </Route>

      {/* Authentication layout */}
      <Route path="auth" element={<BlankLayout />}>
        <Route path="404" element={<Error />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
    </>,
  ),
);

export default Router;