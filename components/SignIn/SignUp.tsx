import React, {
  useState,
  useEffect,
  ReactComponentElement,
  FunctionComponent
} from "react";
import addrs, { ParsedMailbox } from "email-addresses";
import styled from "styled-components";
import axios, { AxiosError } from "axios";
import GoogleLogin from "react-google-login";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  ButtonBase,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  FormHelperText,
  Divider,
  Typography
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { StandardForm, StyledStandardForm } from "@components/Library.js";
import { StandardButton } from "@components/Buttons/SignInButton";
import FacebookSignInButton from "@components/Buttons/FacebookSignInButton";
import GoogleSignInButton from "@components/Buttons/GoogleSignInButton";
import styles from "@styles/WelcomeSignUp.module.css";
import AFBaseFormField, {
  FormField,
  FormConfig
} from "@components/Library/FormField/BaseFormField";
import AFPasswordFormField from "@components/Library/FormField/Variants/PasswordFormField/PasswordFormField";
import AFButton from "@components/Library/Button/Button";

function checkValidEmail(email: string): boolean {
  try {
    const address = (addrs.parseOneAddress(email) as ParsedMailbox) || null;
    if (address !== null) {
      return true;
    } else {
      return false;
    }
  } catch (ex) {
    return false;
  }
}

function checkPasswordLength(password: string) {
  return password.length >= 8;
}

// Check for an uppercase character
function checkPasswordUppercase(password: string) {
  const pattern = /[A-Z]/;
  return pattern.test(password);
}

function checkPasswordNumber(password: string) {
  const pattern = /[0-9]/;
  return pattern.test(password);
}

function SocialBanner(props: { fontSize?: string }) {
  return (
    <Grid container justifyContent="center">
      <Grid container alignItems="center" item xs>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
      <Grid item xs="auto" style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Typography
          style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: props.fontSize }}
          variant="overline"
        >
          Or
        </Typography>
      </Grid>
      <Grid container alignItems="center" item xs>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </Grid>
  );
}

async function postSignUp(
  payload: {
    name: string;
    email: string;
    password: string;
  },
  onFailure: (error: any) => void,
  onSuccess: (response: any) => void
) {
  try {
    const { name, email, password } = payload;
    const response = await axios.post(
      "/signup/new",
      {
        name,
        email,
        password
      },
      { withCredentials: true }
    );
    onSuccess(response);
  } catch (error: any) {
    onFailure(error);
  }
}

function onSignUpFailure(
  error: any,
  setSignUpFailedMessage: (message: string) => void
) {
  const defaultMessage = "Could not sign up. Website is undergoing maintence.";
  if (axios.isAxiosError(error)) {
    // The request was made and the server responded with an error code
    // that falls out of 2xx.
    setSignUpFailedMessage(
      error?.response?.data?.statusMessage || defaultMessage
    );
  } else {
    setSignUpFailedMessage(defaultMessage);
  }
}

function AuthPanel(props: { EmailAuthForm: any; SocialMediaAuthForm: any }) {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <props.EmailAuthForm />
      </Grid>
      <Grid style={{ marginTop: 20 }} item xs={12}>
        <div style={{ marginLeft: -36, marginRight: -36 }}>
          <SocialBanner fontSize="1rem" />
        </div>
      </Grid>
      <Grid style={{ marginTop: 20 }} item xs={12}></Grid>
    </Grid>
  );
}

function SignUpForm(props: { onSuccess: (response: any) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signUpFailedMessage, setSignUpFailedMessage] = useState("");

  const theme = useTheme();

  const validName = name !== "";
  const validEmail = checkValidEmail(email);
  const validPasswordLength = checkPasswordLength(password);
  const validPasswordCase = checkPasswordUppercase(password);
  const validPasswordNumber = checkPasswordNumber(password);

  const validPassword =
    password !== "" &&
    validPasswordLength &&
    validPasswordCase &&
    validPasswordNumber;

  const validSignUp = validName && validEmail && validPassword;

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <AFBaseFormField
          fullWidth
          text="Name"
          type="string"
          onChange={(event: any) => setName(event.target.value)}
        />
      </Grid>
      <Grid style={{ marginTop: 24 }} item xs={12}>
        <AFBaseFormField
          fullWidth
          type="email"
          text="Email address"
          error={email !== "" && validEmail === false}
          inputProps={{ spellCheck: false }}
          onChange={(event: any) => setEmail(event.target.value)}
        />
      </Grid>
      <Grid style={{ marginTop: 24 }} item xs={12}>
        <AFPasswordFormField
          text="Password"
          error={password !== "" && !validPassword}
          validPassword={validPassword}
          helperText="Password must be (8) characters or longer, contain one capital letter [A-Z], and one number [0-9]."
          setPassword={setPassword}
        />
      </Grid>
      <Grid style={{ marginTop: 34 }} item xs={12}>
        <AFButton
          onClick={() =>
            postSignUp(
              {
                name,
                email,
                password
              },
              props.onSuccess,
              (error: any) => onSignUpFailure(error, setSignUpFailedMessage)
            )
          }
          styleOverrides={
            validSignUp
              ? { border: "none", backgroundColor: theme.palette.primary.main }
              : { border: "none", backgroundColor: "rgba(0, 0, 0, 0.20)" }
          }
          disabled={!validSignUp}
        >
          <Typography variant="button" style={{ color: "white" }}>
            Sign up
          </Typography>
        </AFButton>
      </Grid>
      {signUpFailedMessage !== "" && (
        <Grid item xs={12}>
          <Typography
            style={{ color: theme.palette.error.main }}
            variant="body1"
          >
            {signUpFailedMessage}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <div style={{ marginLeft: -30, marginRight: -30 }}>
          <SocialBanner fontSize="1rem" />
        </div>
      </Grid>
      <Grid style={{ marginTop: 12 }} item xs={12}>
        <GoogleSignInButton text="Sign up with Google" />
      </Grid>
      <Grid style={{ marginTop: 12 }} item xs={12}>
        <FacebookSignInButton text="Sign up with Facebook" />
      </Grid>
    </Grid>
  );
}
export { SignUpForm, SocialBanner };
