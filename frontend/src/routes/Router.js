import React from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

const BlankLayout = Loadable(React.lazy(() => import('../layouts/blank/BlankLayout')));
const FullLayout = Loadable(React.lazy(() => import('../layouts/full/FullLayout')));
const ExamLayout = Loadable(React.lazy(() => import('../layouts/full/ExamLayout')));

// Pages
const SamplePage = Loadable(React.lazy(() => import('../views/sample-page/SamplePage')));
const Success = Loadable(React.lazy(() => import('../views/Success')));
const TestPage = Loadable(React.lazy(() => import('../views/student/TestPage')));
const ExamPage = Loadable(React.lazy(() => import('../views/student/ExamPage')));
const ExamDetails = Loadable(React.lazy(() => import('../views/student/ExamDetails')));
const ResultPage = Loadable(React.lazy(() => import('../views/student/ResultPage')));
const StudentResultsList = Loadable(React.lazy(() => import('../views/student/StudentResultsList')));
const Error = Loadable(React.lazy(() => import('../views/authentication/Error')));
const Register = Loadable(React.lazy(() => import('../views/authentication/Register')));
const Login = Loadable(React.lazy(() => import('../views/authentication/Login')));
const UserAccount = Loadable(React.lazy(() => import('../views/authentication/UserAccount')));
const CreateExamPage = Loadable(React.lazy(() => import('../views/teacher/CreateExamPage')));
const ExamLogPage = Loadable(React.lazy(() => import('../views/teacher/ExamLogPage')));
const AddQuestions = Loadable(React.lazy(() => import('../views/teacher/AddQuestions')));
const PrivateRoute = Loadable(React.lazy(() => import('src/views/authentication/PrivateRoute')));
const TeacherRoute = Loadable(React.lazy(() => import('src/views/authentication/TeacherRoute')));

const Router = () => {
  const location = useLocation();
  const element = useRoutes([
    {
      element: <PrivateRoute />,
      children: [
        {
          path: '/',
          element: <FullLayout />,
          children: [
            { index: true, element: <Navigate to="/dashboard" /> },
            { path: 'dashboard', element: <ExamPage /> },
            { path: 'exam', element: <Navigate to="/dashboard" replace /> },
            { path: 'sample-page', element: <SamplePage /> },
            { path: 'Success', element: <Success /> },
            { path: 'exam/:examId/result', element: <ResultPage /> },
            { path: 'student/results/all', element: <StudentResultsList /> },
            {
              element: <TeacherRoute />,
              children: [
                { path: 'create-exam', element: <CreateExamPage /> },
                { path: 'add-questions', element: <AddQuestions /> },
                { path: 'exam-log', element: <ExamLogPage /> },
              ],
            },
          ],
        },
        {
          path: 'exam/:examId',
          element: <ExamLayout />,
          children: [
            { index: true, element: <ExamDetails /> },
            { path: ':testId', element: <TestPage /> },
          ],
        },
      ],
    },
    {
      path: 'user',
      element: <FullLayout />,
      children: [{ path: 'account', element: <UserAccount /> }],
    },
    {
      path: 'auth',
      element: <BlankLayout />,
      children: [
        { path: '404', element: <Error /> },
        { path: 'register', element: <Register /> },
        { path: 'login', element: <Login /> },
      ],
    },
    { path: '*', element: <Navigate to="/auth/404" /> },
  ]);

  return React.cloneElement(element, { key: location.key });
};

export default Router;
