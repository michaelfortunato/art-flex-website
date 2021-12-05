import React, { useEffect, useState, useRef, forwardRef } from "react";
import Link from "next/link";
import { Grid, Paper, Typography, useTheme } from "@material-ui/core";
import { StandardForm, PasswordForm } from "@components/Library";
import styled from "styled-components";
import SignInHome from "@components/SignIn/SignInHome";
import EmailSignIn from "@components/SignIn/SignInEmail";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import SuccessfulSignUp from "@components/Welcome/SuccessfulSignUp";
import GoogleSignInButton from "@components/Buttons/GoogleSignInButton";
import FacebookSignInButton from "@components/Buttons/FacebookSignInButton";
import { SocialBanner } from "./SignUp";
import axios from "axios";
import { signIn } from "redux-store/features/account/accountSlice";
import { useDispatch } from "react-redux";
import { StandardButton } from "@components/Buttons/SignInButton";
import { useRouter } from "next/router";
import { SignUpForm } from "@components/SignIn/SignUp";
import AFButton from "@components/Library/Button/Button";
const WrappedPaper = ({ mdDown, ...props }) => <Paper {...props} />;

const Pane = styled(motion(Paper))`
    padding: 30px;
    overflow-x: hidden;
    overflow-y: hidden;
    display: inline;
    border-radius: 24px;
    position: relative;
    width: 100%:
    z-index: 2;
    &.ani-enter {
        opacity: 0;
        transform: translateY(-20px);
    }
    &.ani-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: all 500ms;
    } 
    &.ani-exit {
        opacity: 1;
        transform: translateY(0px);
    }
    &.ani-exit-active {
        opacity: 0;
        transform: translateY(-20px);
        transition: all 500ms;
    } 

`;
const GridRow = styled(Grid)`
  margin-top: 30px;
  overflow: ;
`;

/*
function SignUpNew(props: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signUpFailed, setSignUpFailed] = useState({
    status: false,
    message: ""
  });

  const theme = useTheme();

  const validSignUp =
    name !== "" &&
    checkValidEmail(email) &&
    checkPasswordLength(password) &&
    checkPasswordUppercase(password) &&
    checkPasswordNumber(password);

  return (
    <Grid container justifyContent="center">
      <Grid
        style={{ marginTop: 30 }}
        alignItems="center"
        container
        item
        xs={12}
      >
        <Grid item xs="auto">
          <Typography variant="h5">Create your account</Typography>
        </Grid>
        <Grid item xs container justifyContent="flex-end">
          <Grid item xs="auto">
            <AFButton
              animateTo={{
                boxShadow: "0 4px 20px rgb(34 34 34 / 15%)",
                scale: 1.02
              }}
              animate={true}
              styleOverrides={{
                padding: "8",
                paddingLeft: "18",
                paddingRight: "18"
              }}
              onClick={() => props.setPage("SignIn")}
            >
              <Typography variant="body1">Sign in</Typography>
            </AFButton>
          </Grid>
        </Grid>
      </Grid>
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
          onChange={(event: any) => handleEmail(event.target.value)}
        />
      </Grid>
      <Grid style={{ marginTop: 24 }} item xs={12}>
        <AFPasswordFormField
          text="Password"
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
          setPassword={setPassword}
        />
      </Grid>
      <Grid style={{ marginTop: 34 }} item xs={12}>
        <AFButton
          onClick={PostSignUp}
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
      {signUpFailed.status && (
        <Grid item xs={12}>
          <Typography
            style={{ color: theme.palette.error.main }}
            variant="body1"
          >
            {signUpFailed.message}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <div style={{ marginLeft: -30, marginRight: -30 }}>
          <SocialBanner />
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
*/

const SignUpPane = props => {
  const [successfulSignUp, setSuccessfulSignUp] = useState(false);
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100%" }}
    >
      <Grid item>
        <AnimatePresence exitBeforeEnter>
          {!successfulSignUp ? (
            <motion.div exit={{ opacity: 0 }}>
              <Grid container justifyContent="center">
                <Grid
                  style={{ marginTop: 30 }}
                  alignItems="center"
                  container
                  item
                  xs={12}
                >
                  <Grid item xs="auto">
                    <Typography variant="h5">Create your account</Typography>
                  </Grid>
                  <Grid item xs container justifyContent="flex-end">
                    <Grid item xs="auto">
                      <AFButton
                        animateTo={{
                          boxShadow: "0 4px 20px rgb(34 34 34 / 15%)",
                          scale: 1.02
                        }}
                        animate={true}
                        styleOverrides={{
                          padding: "8px",
                          paddingLeft: "18px",
                          paddingRight: "18px"
                        }}
                        onClick={() => props.setPage("SignIn")}
                      >
                        <Typography variant="body1">Sign in</Typography>
                      </AFButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <SignUpForm
                    onSuccess={response => setSuccessfulSignUp(true)}
                  />
                </Grid>
              </Grid>
            </motion.div>
          ) : (
            <SuccessfulSignUp
              small
              onAnimationComplete={() =>
                setTimeout(() => props.setOpen(false), 800)
              }
            />
          )}
        </AnimatePresence>
      </Grid>
    </Grid>
  );
};

const SignInForm = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpFailed, setSignUpFailed] = useState({
    status: false,
    message: null
  });
  const theme = useTheme();
  const dispatch = useDispatch();

  const signInSuccess = res => {
    const {
      data: { name, email }
    } = res;
    dispatch(signIn({ name, email }));
  };
  const signInFailure = error => {
    console.log(error);
    if (error.response) {
      setSignUpFailed({
        status: true,
        message: error.response.data.statusMessage
      });
    } else {
      setSignUpFailed({ status: true, message: "Internal server error" });
    }
  };

  useEffect(() => {
    setSignUpFailed({ status: false, message: null });
  }, [email, password]);

  return (
    <Grid container style={{ minWidth: 324, padding: 6 }} direction="row">
      <Grid container item xs={12} alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h5">Sign in</Typography>
        </Grid>
        <Grid item container xs={6} direction="row-reverse">
          <Grid item xs="auto">
            <StandardButton
              animateTo={{
                boxShadow: "0 4px 20px rgb(34 34 34 / 15%)",
                scale: 1.02
              }}
              animate={true}
              styleOverrides={{
                padding: 8,
                paddingLeft: 18,
                paddingRight: 18
              }}
              onClick={() => props.setPage("SignUp")}
            >
              <Typography variant="body1">Register</Typography>
            </StandardButton>
          </Grid>
        </Grid>
      </Grid>
      <GridRow item xs={12}>
        <StandardForm
          type="email"
          text="Email address"
          onChange={event => setEmail(event.target.value)}
        />
      </GridRow>
      <GridRow item xs={12}>
        <PasswordForm
          type="password"
          text="Password"
          setPassword={setPassword}
        />
      </GridRow>
      {signUpFailed.status && (
        <Grid item xs={12}>
          <Typography
            style={{ color: theme.palette.error.main }}
            variant="body1"
          >
            {signUpFailed.message}
          </Typography>
        </Grid>
      )}
      <GridRow style={{ textAlign: "center" }} item xs={12}>
        <Typography variant="body1">
          <Link href="/forgot_password">
            <a style={{ color: "black" }}>Forgot your password?</a>
          </Link>
        </Typography>
      </GridRow>
      <GridRow item xs={12}>
        <StandardButton
          animate
          styleOverrides={{
            width: "100%",
            textAlign: "center",
            borderStyle: "none",
            backgroundColor: theme.palette.primary.main
          }}
          onClick={async () =>
            axios
              .post("/login", { email, password })
              .then(signInSuccess)
              .catch(signInFailure)
          }
        >
          <Typography
            style={{ color: "white", textTransform: "none" }}
            variant="button"
          >
            Sign in
          </Typography>
        </StandardButton>
      </GridRow>

      <Grid style={{ marginTop: 20 }} item xs={12}>
        <div style={{ marginLeft: -36, marginRight: -36 }}>
          <SocialBanner fontSize="1rem" />
        </div>
      </Grid>
      <Grid style={{ marginTop: 12 }} item xs={12}>
        <GoogleSignInButton />
      </Grid>
      <Grid style={{ marginTop: 12 }} item xs={12}>
        <FacebookSignInButton />
      </Grid>
    </Grid>
  );
};

const SignInPane = forwardRef((props, ref) => {
  const [page, setPage] = useState("SignIn");
  return (
    <AnimateSharedLayout>
      <Pane layout ref={ref}>
        <div style={{ maxWidth: 324 }}>
          <AnimatePresence exitBeforeEnter initial={false}>
            {page === "SignIn" ? (
              <motion.div
                key="SignIn"
                initial={{ x: "-150%" }}
                animate={{ x: 0 }}
              >
                <SignInForm setPage={setPage} />
              </motion.div>
            ) : (
              <motion.div
                key="SignUp"
                initial={{ x: "150%" }}
                animate={{ x: 0 }}
              >
                <SignUpPane setPage={setPage} setOpen={props.setOpen} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div layout style={{ marginTop: 20 }}>
            <Typography
              style={{ color: "black", opacity: 0.8 }}
              variant="body2"
            >
              By clicking Sign in, you agree to Art Flex's
              <Link href="/legal/term_of_use">
                <a style={{ color: "inherit" }}> Terms of Use</a>
              </Link>{" "}
              and
              <Link href="/legal/privacy_policy">
                <a style={{ color: "inherit" }}> Privacy Policy</a>
              </Link>
              . You may change your preferences in your account settings at any
              time. We will never post or share your information without your
              explicit permission.
            </Typography>
          </motion.div>
        </div>
      </Pane>
    </AnimateSharedLayout>
  );
});

/*
function SignUpNew(props: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signUpFailed, setSignUpFailed] = useState({
    status: false,
    message: ""
  });

  const theme = useTheme();

  const validSignUp =
    name !== "" &&
    checkValidEmail(email) &&
    checkPasswordLength(password) &&
    checkPasswordUppercase(password) &&
    checkPasswordNumber(password);

  return (
    <Grid container justifyContent="center">
      <Grid
        style={{ marginTop: 30 }}
        alignItems="center"
        container
        item
        xs={12}
      >
        <Grid item xs="auto">
          <Typography variant="h5">Create your account</Typography>
        </Grid>
        <Grid item xs container justifyContent="flex-end">
          <Grid item xs="auto">
            <AFButton
              animateTo={{
                boxShadow: "0 4px 20px rgb(34 34 34 / 15%)",
                scale: 1.02
              }}
              animate={true}
              styleOverrides={{
                padding: "8",
                paddingLeft: "18",
                paddingRight: "18"
              }}
              onClick={() => props.setPage("SignIn")}
            >
              <Typography variant="body1">Sign in</Typography>
            </AFButton>
          </Grid>
        </Grid>
      </Grid>
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
          onChange={(event: any) => handleEmail(event.target.value)}
        />
      </Grid>
      <Grid style={{ marginTop: 24 }} item xs={12}>
        <AFPasswordFormField
          text="Password"
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
          setPassword={setPassword}
        />
      </Grid>
      <Grid style={{ marginTop: 34 }} item xs={12}>
        <AFButton
          onClick={PostSignUp}
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
      {signUpFailed.status && (
        <Grid item xs={12}>
          <Typography
            style={{ color: theme.palette.error.main }}
            variant="body1"
          >
            {signUpFailed.message}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <div style={{ marginLeft: -30, marginRight: -30 }}>
          <SocialBanner />
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



*/
export default SignInPane;
