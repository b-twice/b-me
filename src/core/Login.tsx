import React, { useState, Fragment, useContext } from 'react';

import './Auth.scss';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  RouteProps
} from "react-router-dom";
import { RouteChildrenProps } from 'react-router';
import { Input, FormControl, InputLabel,  Theme, Button, Container, Paper, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { AuthContext } from './Auth';


const useLoginStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column'
    },
    formControl: {
      margin: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(3, 2),
    },
    submit: {
        color: theme.palette.primary.dark
    }
  }),
);

export default function Login(props: RouteChildrenProps): JSX.Element {
    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");
    const [error, setError] = useState(false);
    let { from } = props.location.state || { from: { pathname: "/upcoming" } };
    const classes = useLoginStyles();

    function onLogin(err:any, result:any): void {
        if (err) {
            setError(true);
        }
    }
    
    const handleSubmit = (evt: React.FormEvent) => {
        setError(false);
        evt.preventDefault();
        authContext.login(username, pw, onLogin)
    }

    const authContext = useContext(AuthContext);

    return (
        <Fragment>
            { authContext.authenticated ? (
                <Redirect to={from} />
            ) : (
            <Container maxWidth="sm">
                <Paper className={classes.paper}>
                    { error && 
                        <Typography variant="overline" color="error">
                            Login failed.
                        </Typography>

                    }
                    <Typography variant="h5" component="h3">
                        Login
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <FormControl className={classes.formControl} variant="filled">
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input 
                                id="username"
                                onChange={e => setUsername(e.target.value.trim())} 
                            />
                        </FormControl>
                        <FormControl className={classes.formControl} variant="filled">
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                id="password"  
                                onChange={e => setPw(e.target.value.trim())} 
                                type="password"
                            />
                        </FormControl>
                        <Button className={classes.submit} type="submit" variant="contained"  onClick={handleSubmit} color="primary">
                            Submit
                        </Button>
                    </form>
                </Paper>
            </Container>
            )}
        </Fragment>
   );
}

