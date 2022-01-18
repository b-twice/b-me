import React, { useState, useContext } from "react";

import {
  Input,
  FormControl,
  InputLabel,
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { AuthContext } from "./Auth";
import { Navigate, useLocation } from "react-router-dom";
import { styled } from "@mui/system";

const LoginForm = styled("form")({
  display: "flex",
  flexDirection: "column",
});
const LoginFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
}));

export default function Login(): JSX.Element {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);

  let from = (location.state as Record<string, any>)?.from?.pathname || "/";

  function onLogin(err: any, result: any): void {
    if (err) {
      setError(true);
    }
    setDisabled(false);
  }

  const handleSubmit = (evt: React.FormEvent) => {
    setError(false);
    setDisabled(true);
    evt.preventDefault();
    authContext.login(username, pw, onLogin);
  };

  const authContext = useContext(AuthContext);

  return (
    <>
      {authContext.authenticated ? (
        <Navigate to={from} />
      ) : (
        <Container maxWidth="sm">
          <Paper sx={{ px: 2, py: 3 }}>
            {error && (
              <Typography variant="overline" color="error">
                Login failed.
              </Typography>
            )}
            <Typography variant="h5" component="h3">
              Login
            </Typography>
            <LoginForm onSubmit={handleSubmit}>
              <LoginFormControl variant="filled">
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  id="username"
                  onChange={(e) => setUsername(e.target.value.trim())}
                />
              </LoginFormControl>
              <LoginFormControl variant="filled">
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  onChange={(e) => setPw(e.target.value.trim())}
                  type="password"
                />
              </LoginFormControl>
              <Button
                type="submit"
                variant="contained"
                onClick={handleSubmit}
                color="secondary"
                disabled={disabled}
                sx={{ mt: 2, mr: 0, ml: 0, mb: 0 }}
              >
                Submit
              </Button>
            </LoginForm>
          </Paper>
        </Container>
      )}
    </>
  );
}
