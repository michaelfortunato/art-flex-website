import React, { useState, useEffect } from "react";
import addrs from "email-addresses";
import styled from "styled-components";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import {
  ButtonBase,
  Grid,
  TextField,
  Typography,
  Link,
  FormControl,
  InputLabel,
  Input,
  Divider,
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

const PasswordField = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      label={props.label}
      error={props.error}
      helperText={props.helperText}
      type={showPassword ? "text" : "password"}
      onChange={props.setPassword}
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

const ValidationStatus = (props) => (
  <div>
    {props.isValid ? (
      <CheckIcon style={{ color: "green", verticalAlign: "middle" }} />
    ) : (
      <ClearIcon style={{ color: "red", verticalAlign: "middle" }} />
    )}
    <Typography
      variant="body1"
      style={{ display: "inline", marginLeft: "4px", verticalAlign: "middle" }}
    >
      {props.text}
    </Typography>
  </div>
);
const ValidationStatuses = [
  { Component: ValidationStatus, stateKey: "validEmail", text: "Valid email" },
  {
    Component: ValidationStatus,
    stateKey: "passwordLength",
    text: "Password is at least 8 characters",
  },
  {
    Component: ValidationStatus,
    stateKey: "passwordUppercase",
    text: "Password must contain at least one upper-case letter",
  },
  {
    Component: ValidationStatus,
    stateKey: "passwordNumber",
    text: "Password must contain at least one number",
  },
];

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

export default function SignUp(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validEmail = email !== "";
  const [passwordLength, setPasswordLength] = useState(false);
  const [passwordUppercase, setPasswordUppercase] = useState(false);
  const [passwordNumber, setPasswordNumber] = useState(false);

  const handleEmail = (email) => {
    try {
      const address = addrs.parseOneAddress(email);
      if (address === null) {
        setEmail("");
      } else {
        setEmail(address.address);
      }
    } catch (ex) {
      setEmail("");
    }
  };
  useEffect(() => {
    setPasswordLength(checkPasswordLength(password));
    setPasswordUppercase(checkPasswordUppercase(password));
    setPasswordNumber(checkPasswordNumber(password));
  }, [password]);

  // Useful to have this hash table for index over the ValidationStatuses array
  const validationStates = {
    validEmail: validEmail,
    passwordLength: passwordLength,
    passwordUppercase: passwordUppercase,
    passwordNumber: passwordNumber,
  };

  const theme = useTheme();

  return (
    <Grid container justify="center">
      <Grid
        container
        item
        lg = {4}
        xs={12}
        justify="center"
        spacing={5}
        className={styles.sign_up_body}
      >
        <Grid item xs={12} md = {8}>
          <Typography
            style={{ "margin-top": "-5px", color: "black" }}
            variant="h4"
          >
            Create account
          </Typography>
        </Grid>
        <Grid
          className={styles.field_container}
          item
          xs={12}
          md = {8}
          style={{ "margin-top": "0px" }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Name"
            InputProps={{ spellCheck: false }}
            onChange={(event) => setName(event.target.value)}
          />
        </Grid>
        <Grid className={styles.field_container} item xs={12} md = {8}>
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            InputProps={{ spellCheck: false }}
            onChange={(event) => handleEmail(event.target.value)}
          />
        </Grid>
        <Grid className={styles.field_container} item xs={12} md = {8}>
          <PasswordField
            label="Password"
            password={password}
            setPassword={() => setPassword(event.target.value)}
          />
        </Grid>
        <Grid container item xs={12} spacing={2} md = {8}>
          {ValidationStatuses.map(
            ({ Component, stateKey, text }, ithValCheck) => (
              <Grid key={ithValCheck} item xs={12}  >
                <Component isValid={validationStates[stateKey]} text={text} />
              </Grid>
            )
          )}
        </Grid>
        <Grid style={{ "margin-top": "10px" }} item lg = {8} md = {8} xs={12}>
          <ButtonBase
            className={styles.create_account_button}
            style={{ backgroundColor: theme.palette.primary.main }}
          >
            <Typography variant = "body1" style={{ fontSize: "1.5rem", color: "white" }}>
              Sign up
            </Typography>
          </ButtonBase>
        </Grid>
      </Grid>
    </Grid>
  );
}
