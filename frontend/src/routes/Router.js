import React, { lazy } from 'react';
import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import { useSelector } from 'react-redux';

/* ***Layouts**** */
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const ExamLayout = Loadable(lazy(() => import('../layouts/full/ExamLayout')));

/* ****Pages***** */
// const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')));
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Success = Loadable(lazy(() => import('../views/Success')));
// const Icons = Loadable(lazy(() => import('../views/icons/Icons')));
// const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')));
// const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
//Student Routes

const TestPage = Loadable(lazy(() => import('./../views/student/TestPage')));
const ExamPage = Loadable(lazy(() => import('./../views/student/ExamPage')));
const ExamDetails = Loadable(lazy(() => import('./../views/student/ExamDetails')));
const ResultPage = Loadable(lazy(() => import('./../views/student/ResultPage')));
const StudentResultsList = Loadable(lazy(() => import('./../views/student/StudentResultsList')));
//Auth Routes
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const UserAccount = Loadable(lazy(() => import('../views/authentication/UserAccount')));

// Teacher Routes
const CreateExamPage = Loadable(lazy(() => import('./../views/teacher/CreateExamPage')));
const ExamLogPage = Loadable(lazy(() => import('./../views/teacher/ExamLogPage')));
const AddQuestions = Loadable(lazy(() => import('./../views/teacher/AddQuestions')));
const PrivateRoute = Loadable(lazy(() => import('src/views/authentication/PrivateRoute')));
const TeacherRoute = Loadable(lazy(() => import('src/views/authentication/TeacherRoute')));

const Router = createBrowserRouter(
  createRoutesFromElements(
    // Every router we create will now go in here as
    // they going to be child of our main App component
    <>
      {/* // Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        {/* // Main layout */}
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
        {/* <Route path="*" element={<Navigate to="/auth/404" />} /> */}
      </Route>
    </>,
  ),
);

export default Router;