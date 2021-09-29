import React, { useState, useEffect } from "react";
import addrs from "email-addresses";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import { useTheme, makeStyles, withStyles } from "@material-ui/core/styles";
import GoogleLogin from "react-google-login";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import useSWR from "swr";
import axios from "axios";
import post from "utils/post";
import {
  ButtonBase,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import {
  ArrowBackIosOutlined,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import styles from "@styles/WelcomeSignUp.module.css";

const validHelperText = (validEntry) =>
  makeStyles({
    root: {
      color: `${validEntry ? "green" : null}`,
    },
    contained: {
      marginLeft: "1px",
    },
  });

const PasswordField = (props) => {
  const helperTextClasses = validHelperText(props.validPassword)();

  const [showPassword, setShowPassword] = useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      FormHelperTextProps={{ classes: helperTextClasses }}
      label={props.label}
      error={props.error}
      helperText={props.helperText}
      type={showPassword ? "text" : "password"}
      onChange={(event) => props.setPassword(event.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const checkPasswordLength = (password) => {
  return password.length >= 8;
};

// Check for an uppercase character
const checkPasswordUppercase = (password) => {
  const pattern = /[A-Z]/;
  return pattern.test(password);
};

const checkPasswordNumber = (password) => {
  const pattern = /[0-9]/;
  return pattern.test(password);
};

const SocialBanner = (props) => (
  <Grid container item xs={12} justifyContent="center">
    <Grid container alignItems="center" item xs={5}>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
    <Grid style={{ textAlign: "center" }} item xs={1}>
      <Typography style={{ color: "rgba(0, 0, 0, 0.54)" }} variant="overline">
        Or
      </Typography>
    </Grid>
    <Grid container alignItems="center" item xs={5}>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  </Grid>
);

const StyledContainer = styled(Grid)``;

export default function SignUp(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validEmail, setValidEmail] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);
  const [passwordUppercase, setPasswordUppercase] = useState(false);
  const [passwordNumber, setPasswordNumber] = useState(false);

  const [signUpFailed, setSignUpFailed] = useState({
    status: false,
    message: "",
  });

  const theme = useTheme();
  const emailHelperTextClasses = validHelperText(validEmail)();

  const handleEmail = (email) => {
    try {
      const address = addrs.parseOneAddress(email);
      if (address === null) {
        setValidEmail(false);
        setEmail(email);
      } else {
        setValidEmail(true);
        setEmail(address.address);
      }
    } catch (ex) {
      setValidEmail(false);
      setEmail(email);
    }
  };

  const PostSignUp = async () => {
    try {
      const response = await post("/signup/new", {
        "name": name,
        "email": email,
        "password": password
      }).then((res) => res.json());
      props.setCurrentPage(5);
    } catch (error) {
      setSignUpFailed({
        status: true,
        message: "Could not sign up. Website is undergong maintenence.",
      });
    }
  };

  useEffect(() => {
    setPasswordLength(checkPasswordLength(password));
    setPasswordUppercase(checkPasswordUppercase(password));
    setPasswordNumber(checkPasswordNumber(password));
  }, [password]);

  useEffect(() => {
    setSignUpFailed({
      status: false,
      message: "",
    });
  }, [name, email, password]);

  const validSignUp =
    name !== "" &&
    validEmail &&
    passwordLength &&
    passwordUppercase &&
    passwordNumber;

  return (
    <StyledContainer container justifyContent="center">
      <Grid
        component={Paper}
        container
        item
        lg={6}
        xs={12}
        justifyContent="center"
        spacing={3}
        className={styles.sign_up_body}
      >
        <Grid item xs={12} className={styles.title_container}>
          <Typography variant="h2">Create your account</Typography>
        </Grid>
        <Grid
          className={styles.field_container}
          item
          md={8}
          xs={12}
          style={{ marginTop: "0px" }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Name"
            InputProps={{ spellCheck: false }}
            onChange={(event) => setName(event.target.value)}
          />
        </Grid>
        <Grid className={styles.field_container} item md={8} xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            error={email !== "" && validEmail === false}
            helperText={
              email !== "" && validEmail === false ? "Invalid email" : null
            }
            FormHelperTextProps={{ classes: emailHelperTextClasses }}
            InputProps={{ spellCheck: false }}
            onChange={(event) => handleEmail(event.target.value)}
          />
        </Grid>
        <Grid className={styles.field_container} item md={8} xs={12}>
          <PasswordField
            error={
              password !== "" &&
              (!passwordLength || !passwordUppercase || !passwordNumber)
            }
            validPassword={
              password !== "" &&
              passwordLength &&
              passwordUppercase &&
              passwordNumber
            }
            helperText="Password must be (8) characters or longer, contain one capital letter [A-Z], and one number [0-9]."
            label="Password"
            password={password}
            setPassword={setPassword}
          />
        </Grid>

        <Grid item lg={6} md={8} xs={12}>
          <ButtonBase
            onClick={PostSignUp}
            className={styles.create_account_button}
            style={
              validSignUp
                ? { backgroundColor: theme.palette.primary.main }
                : { backgroundColor: "rgba(0, 0, 0, 0.20)" }
            }
            disabled={!validSignUp}
          >
            <Typography variant="button" style={{ color: "white" }}>
              Sign up
            </Typography>
          </ButtonBase>
        </Grid>
        {signUpFailed.status && (
          <Grid item xs={12} className={styles.field_container}>
            <Typography
              style={{ color: theme.palette.error.main }}
              variant="body1"
            >
              {signUpFailed.message}
            </Typography>
          </Grid>
        )}
        <SocialBanner />
        <Grid container justifyContent="center" item xs={12}>
          <GoogleLogin
            buttonText="Sign up with Google"
            theme="dark"
            uxMode="redirect"
          />
        </Grid>
      </Grid>
    </StyledContainer>
  );
}
