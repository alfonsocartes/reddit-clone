import { CognitoUser } from "@aws-amplify/auth";
// Styles
import { Button, Grid, Snackbar, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
// AWS Amplify
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// Context
import { useUser } from "../context/AuthContext";

interface IFormInput {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [logInError, setLogInError] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { username, password } = data;
    try {
      await Auth.signIn(username, password);
      router.push("/");
    } catch (error) {
      setLogInError(error.message);
      setOpen(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <TextField
                variant="outlined"
                id="username"
                label="Username"
                type="text"
                error={errors.username ? true : false}
                helperText={errors.username ? errors.username.message : null}
                {...register("username")}
              />
            </Grid>

            <Grid item>
              <TextField
                variant="outlined"
                id="password"
                label="Password"
                type="password"
                error={errors.password ? true : false}
                helperText={errors.password ? errors.password.message : null}
                {...register("password")}
              />
            </Grid>
          </Grid>

          <Grid style={{ marginTop: 16 }}>
            <Button variant="contained" type="submit">
              Log in
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {logInError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
