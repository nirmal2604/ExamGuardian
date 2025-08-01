import React, { useEffect } from 'react';
import { 
  Grid, 
  Box, 
  Card, 
  Typography, 
  Stack, 
  Container,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  AccountCircle as AccountCircleIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateUserMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import Loader from './Loader';
import AuthUpdate from './auth/AuthUpdate';
import { keyframes } from '@emotion/react';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const userValidationSchema = yup.object({
  name: yup.string().min(2).max(25).required('Please enter your name'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Password must match'),
  role: yup.string().oneOf(['student', 'teacher'], 'Invalid role').required('Role is required'),
});

const UserAccount = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { userInfo } = useSelector((state) => state.auth);

  const initialUserValues = {
    name: userInfo.name || '',
    email: userInfo.email || '',
    password: '',
    confirm_password: '',
    role: userInfo.role || 'student',
  };

  const formik = useFormik({
    initialValues: initialUserValues,
    validationSchema: userValidationSchema,
    onSubmit: (values, action) => {
      handleSubmit(values);
    },
  });

  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  const handleSubmit = async ({ name, email, password, confirm_password, role }) => {
    if (password !== confirm_password) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
          role,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success('Profile updated successfully');
        formik.setFieldValue('password', '');
        formik.setFieldValue('confirm_password', '');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const getRoleIcon = (role) => {
    return role === 'teacher' ? <SchoolIcon /> : <PersonIcon />;
  };

  const getRoleColor = (role) => {
    return role === 'teacher' ? 'secondary' : 'primary';
  };

  return (
    <PageContainer title="User Account Settings" description="Update your account information and profile settings">
      <Box
        sx={{
          minHeight: '100vh',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 50%, ${theme.palette.grey[900]} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 50%, ${theme.palette.primary.light}15 100%)`,
          backgroundSize: '400% 400%',
          animation: `${gradientShift} 15s ease infinite`,
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 6, animation: `${fadeIn} 0.8s ease-out` }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
                p: 2,
                borderRadius: 3,
                backgroundColor: 'background.paper',
                boxShadow: theme.shadows[6],
                border: `1px solid ${theme.palette.divider}`,
                animation: `${float} 3s ease-in-out infinite`,
              }}
            >
              <SettingsIcon 
                sx={{ 
                  fontSize: 40, 
                  color: theme.palette.primary.main,
                }} 
              />
              <Typography
                variant={isMobile ? "h4" : "h3"}
                component="h1"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Account Settings
              </Typography>
            </Box>
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Manage your personal information and account preferences
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {/* Profile Info Card */}
            <Grid item xs={12} lg={4}>
              <Card
                elevation={8}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`,
                  height: 'fit-content',
                  position: 'sticky',
                  top: 20,
                  animation: `${fadeIn} 0.8s ease-out 0.2s both`,
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mx: 'auto',
                      mb: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      boxShadow: theme.shadows[8],
                    }}
                  >
                    {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  
                  <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                    {userInfo?.name || 'User Name'}
                  </Typography>
                  
                  <Chip
                    icon={getRoleIcon(userInfo?.role)}
                    label={userInfo?.role?.toUpperCase() || 'STUDENT'}
                    color={getRoleColor(userInfo?.role)}
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      px: 2,
                      py: 1,
                    }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Profile Details */}
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: theme.palette.primary.light + '20',
                        color: theme.palette.primary.main,
                      }}
                    >
                      <PersonIcon />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Full Name
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        {userInfo?.name || 'Not specified'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: theme.palette.secondary.light + '20',
                        color: theme.palette.secondary.main,
                      }}
                    >
                      <EmailIcon />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Email Address
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        {userInfo?.email || 'Not specified'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: theme.palette.success.light + '20',
                        color: theme.palette.success.main,
                      }}
                    >
                      <BadgeIcon />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Account Type
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        {userInfo?.role?.charAt(0).toUpperCase() + userInfo?.role?.slice(1) || 'Student'}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            {/* Update Form Card */}
            <Grid item xs={12} lg={8}>
              <Card
                elevation={8}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`,
                  animation: `${fadeIn} 0.8s ease-out 0.4s both`,
                }}
              >
                {/* Form Header */}
                <Box
                  sx={{
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                      : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    p: 4,
                    color: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EditIcon sx={{ fontSize: 30 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        Update Profile Information
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                        Keep your account information up to date and secure
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Form Content */}
                <Box sx={{ p: 4 }}>
                  {isLoading && <Loader />}
                  <AuthUpdate
                    formik={formik}
                    onSubmit={handleSubmit}
                    title={null} // We're using our own title above
                    isUpdateMode={true}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Security Notice */}
          <Box sx={{ mt: 4, animation: `${fadeIn} 0.8s ease-out 0.6s both` }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? theme.palette.warning.dark + '20'
                  : theme.palette.warning.light + '20',
                border: `1px solid ${theme.palette.warning.main}30`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SecurityIcon sx={{ color: theme.palette.warning.main, fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                    Security Notice
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Always use a strong password with at least 8 characters
                    • Keep your email address up to date for security notifications
                    • Contact support if you notice any unauthorized changes to your account
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </PageContainer>
  );
};

export default UserAccount;