import React, { useState } from "react";
import Navbar from "../Navbar";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { apiWithoutToken } from "../Api";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'© RemoteCollaborate'} {new Date().getFullYear()}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [fieldErrors, setfieldErrors] = useState({});
  const [otherErrors, setotherErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiWithoutToken.post("/auth/register/", {
        email,
        password,
        username,
        last_name: lastName,
        first_name: firstName,
        password2: password2,
      });
      navigate("/login")
    } catch (error) {
      if (error.response.data.detail) {
        setotherErrors([error.response.data.detail]);
      } else if (error.response.data.message) {
        setotherErrors([error.response.data.message]);
      } else if (error.response.data.non_field_errors) {
        setotherErrors(error.response.data.non_field_errors);
      } else {
        setfieldErrors(error.response.data);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }} >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {otherErrors && Object.values(otherErrors).map((errorMessage) => {
            return (
              <div className="alert alert-danger w-100">{errorMessage}</div>
            )
          })
          }

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {fieldErrors.first_name && (<div className="text-danger w-100">{fieldErrors.first_name}</div>)}
                <TextField required fullWidth label="First Name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                {fieldErrors.last_name && (<div className="text-danger w-100">{fieldErrors.last_name}</div>)}
                <TextField required fullWidth label="Last Name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
              </Grid>
              <Grid item xs={12}>
                {fieldErrors.username && (<div className="text-danger w-100">{fieldErrors.username}</div>)}
                <TextField required fullWidth label="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
              </Grid>
              <Grid item xs={12}>
                {fieldErrors.email && (<div className="text-danger w-100">{fieldErrors.email}</div>)}
                <TextField required fullWidth label="Email Address" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </Grid>
              <Grid item xs={12}>
                {fieldErrors.password && (<div className="text-danger w-100">{fieldErrors.password}</div>)}
                <TextField required fullWidth label="Password" type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </Grid>
              <Grid item xs={12}>
                {fieldErrors.password2 && (<div className="text-danger w-100">{fieldErrors.password2}</div>)}
                <TextField required fullWidth label="Confirm Password" type="password" id="password2" value={password2} onChange={(event) => setPassword2(event.target.value)} />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" className="bg-success" sx={{ mt: 3, mb: 2 }}> Sign Up </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}