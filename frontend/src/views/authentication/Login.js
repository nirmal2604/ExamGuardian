import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography, useTheme, keyframes } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from './auth/AuthLogin';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from './../../slices/usersApiSlice';
import { setCredentials } from './../../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from './Loader';

// Animation keyframes
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const userValidationSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(2, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const initialUserValues = {
  email: '',
  password: '',
};

const Login = () => {
  const theme = useTheme();
  const formik = useFormik({
    initialValues: initialUserValues,
    validationSchema: userValidationSchema,
    onSubmit: (values, action) => {
      handleSubmit(values);
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const handleSubmit = async ({ email, password }) => {
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      formik.resetForm();

      const redirectLocation = JSON.parse(localStorage.getItem('redirectLocation'));
      if (redirectLocation) {
        localStorage.removeItem('redirectLocation');
        navigate(redirectLocation.pathname);
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  return (
    <PageContainer title="Login" description="Secure online exam platform login">
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default', // Add this line
          '&:before': {
            content: '""',
            background: `linear-gradient(-45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light}, ${theme.palette.info.light})`,
            backgroundSize: '400% 400%',
            animation: `${gradientAnimation} 15s ease infinite`,
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
            zIndex: 0,
          },
        }}
      >
        {/* Decorative floating elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
            opacity: 0.1,
            animation: `${floatAnimation} 6s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.secondary.main} 0%, transparent 70%)`,
            opacity: 0.1,
            animation: `${floatAnimation} 8s ease-in-out infinite`,
            animationDelay: '2s',
          }}
        />

        <Grid container justifyContent="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card
              elevation={10}
              sx={{
                p: { xs: 3, sm: 6 },
                borderRadius: 4,
                backgroundColor: 'background.paper',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[12],
                },
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                mb={4}
              >
                <Logo />
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    mt: 2,
                    fontWeight: 700,
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  color="textSecondary"
                  mt={1}
                  sx={{
                    maxWidth: '80%',
                    '&:after': {
                      content: '""',
                      display: 'block',
                      width: '60px',
                      height: '3px',
                      background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      margin: '16px auto',
                      borderRadius: '3px',
                    },
                  }}
                >
                  CONDUCT SECURE ONLINE EXAMS NOW
                </Typography>
              </Box>

              <AuthLogin formik={formik} isLoading={isLoading} />

              <Stack direction="row" spacing={1} justifyContent="center" mt={4}>
                <Typography color="textSecondary" variant="body1" fontWeight="500">
                  New to our platform?
                </Typography>
                <Typography
                  component={Link}
                  to="/auth/register"
                  fontWeight="600"
                  sx={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Create an account
                </Typography>
              </Stack>

              {isLoading && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Loader />
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login;
