import React, { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  Link,
  Avatar
} from '@mui/material';
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  Email,
  Person,
  ConnectingAirportsOutlined
} from '@mui/icons-material';
import axios from 'axios';
import instance from '../../API';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TabPanel = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </Box>
);

const AuthPage = () => {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await instance.post('/api/auth/login', loginData);
      setSuccess('Login successful!');
      console.log(response);
      login(response.data.user, response.data.token);
      if(response.data.user.role === 'admin'){
        navigate('/admin');
      }else{
        navigate('/crm');
      }     
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    console.log(signupData.password);

    setLoading(true);

    try {
      const response = await instance.post('/api/auth/signup', {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password
      });
      setSuccess('Account created successfully!');
      // login(response.data.user, response.data.token);
      // navigate('/crm');
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ width: '100%', mt: 3 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="Login" 
              icon={<LockOutlined />} 
              iconPosition="start"
            />
            <Tab 
              label="Sign Up" 
              icon={<Person />} 
              iconPosition="start"
            />
          </Tabs>

          {/* Login Panel */}
          <TabPanel value={tab} index={0}>
            <Box component="form" onSubmit={handleLogin} noValidate>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main', mx: 'auto' }}>
                <LockOutlined />
              </Avatar>
              <Typography component="h1" variant="h5" textAlign="center" mb={3}>
                Sign In
              </Typography>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={loginData.email}
                onChange={handleLoginChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={loginData.password}
                onChange={handleLoginChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link href="#" variant="body2" onClick={() => setTab(1)}>
                  Don't have an account? Sign Up
                </Link>
              </Box>
            </Box>
          </TabPanel>

          {/* Signup Panel */}
          <TabPanel value={tab} index={1}>
            <Box component="form" onSubmit={handleSignup} noValidate>
              <Avatar sx={{ m: 1, bgcolor: 'primary.main', mx: 'auto' }}>
                <Person />
              </Avatar>
              <Typography component="h1" variant="h5" textAlign="center" mb={3}>
                Create Account
              </Typography>

              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={signupData.name}
                onChange={handleSignupChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="signupEmail"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={signupData.email}
                onChange={handleSignupChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="signupPassword"
                value={signupData.password}
                onChange={handleSignupChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
              />

              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link href="#" variant="body2" onClick={() => setTab(0)}>
                  Already have an account? Sign In
                </Link>
              </Box>
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage;