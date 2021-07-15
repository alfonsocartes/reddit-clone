import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";

// AWS Amplify
import { Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";

// Styles
import { Button, Grid, TextField, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

// Context
import { useUser } from "../context/AuthContext";

interface IFormInput {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const [logInError, setLogInError] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { username, password } = data;
    const amplifyUser = await Auth.signIn(username, password);
    console.log("Success, signed in a user", amplifyUser);
    if (amplifyUser) {
      router.push("/");
    } else {
      throw new Error("Error, something whent wrong");
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid container direction="column" alignItems="center" justify="center">
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item>
            <TextField
              variant="outlined"
              id="username"
              label="Username"
              type="text"
              error={errors.username ? true : false}
              helperText={errors.username ? errors.username.message : null}
              {...register("username", {
                required: { value: true, message: "Please enter a username." },
                minLength: {
                  value: 3,
                  message: "Please enter a username between 3-16 characters.",
                },
                maxLength: {
                  value: 16,
                  message: "Please enter a username between 3-16 characters.",
                },
              })}
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
              {...register("password", {
                required: { value: true, message: "Please enter a password." },
                minLength: {
                  value: 8,
                  message: "Please enter a stronger password.",
                },
              })}
            />
          </Grid>
        </Grid>

        <Grid style={{ marginTop: 16 }}>
          <Button variant="contained" type="submit">
            Log in
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {logInError}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default Login;
