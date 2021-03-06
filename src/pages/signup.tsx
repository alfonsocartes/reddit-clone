import { CognitoUser } from "@aws-amplify/auth";
// Styles
import { Button, Grid, Snackbar,TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
// AWS Amplify
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SubmitHandler,useForm } from "react-hook-form";

// Context
import { useUser } from "../context/AuthContext";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  code: string;
}

const Signup = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const [signUpError, setSignUpError] = useState<string>("");
  const [showCode, setShowCode] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  async function signUpWithEmailAndPassword(
    data: IFormInput
  ): Promise<CognitoUser> {
    const { username, password, email } = data;
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log("Signed up user", user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function confirmSignUp(data: IFormInput) {
    const { username, password, code } = data;

    try {
      await Auth.confirmSignUp(username, code);
      const amplifyUser = await Auth.signIn(username, password);
      console.log("Success, signed in a user", amplifyUser);
      if (amplifyUser) {
        router.push("/");
      } else {
        throw new Error("Error, something whent wrong");
      }
    } catch (error) {
      console.log("Error confirming sign up", error);
    }
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (showCode) {
        confirmSignUp(data);
      } else {
        await signUpWithEmailAndPassword(data);
        setShowCode(true);
      }
    } catch (error) {
      console.error(error);
      setSignUpError(error.message);
      setOpen(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  console.log("The value from the user from the hook is:", user);

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
              id="email"
              label="Email"
              type="email"
              error={errors.email ? true : false}
              helperText={errors.email ? errors.email.message : null}
              {...register("email", {
                required: {
                  value: true,
                  message: "Please enter a valid email.",
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

        {showCode && (
          <Grid item>
            <TextField
              variant="outlined"
              id="code"
              label="Verification Code"
              type="text"
              error={errors.code ? true : false}
              helperText={errors.code ? errors.code.message : null}
              {...register("code", {
                required: {
                  value: true,
                  message: "Please enter the verification code.",
                },
                minLength: {
                  value: 6,
                  message: "Please enter the correct verification code.",
                },
                maxLength: {
                  value: 6,
                  message: "Please enter the correct verification code.",
                },
              })}
            />
          </Grid>
        )}

        <Grid style={{ marginTop: 16 }}>
          <Button variant="contained" type="submit">
            {showCode ? "Confirm Code" : "Sign Up"}
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {signUpError}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default Signup;
