import React, { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const ExamLayout = Loadable(lazy(() => import('../layouts/full/ExamLayout')));

/* ****Pages***** */
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Success = Loadable(lazy(() => import('../views/Success')));
const TestPage = Loadable(lazy(() => import('./../views/student/TestPage')));
const ExamPage = Loadable(lazy(() => import('./../views/student/ExamPage')));
const ExamDetails = Loadable(lazy(() => import('./../views/student/ExamDetails')));
const ResultPage = Loadable(lazy(() => import('./../views/student/ResultPage')));
const StudentResultsList = Loadable(lazy(() => import('./../views/student/StudentResultsList')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const UserAccount = Loadable(lazy(() => import('../views/authentication/UserAccount')));
const CreateExamPage = Loadable(lazy(() => import('./../views/teacher/CreateExamPage')));
const ExamLogPage = Loadable(lazy(() => import('./../views/teacher/ExamLogPage')));
const AddQuestions = Loadable(lazy(() => import('./../views/teacher/AddQuestions')));
const PrivateRoute = Loadable(lazy(() => import('src/views/authentication/PrivateRoute')));
const TeacherRoute = Loadable(lazy(() => import('src/views/authentication/TeacherRoute')));

const Router = () => {
  const routes = useRoutes([
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
    // fallback route
    { path: '*', element: <Navigate to="/auth/404" /> },
  ]);

  return routes;
};

export default Router;
