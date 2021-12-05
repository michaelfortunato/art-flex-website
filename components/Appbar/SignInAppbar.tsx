import React, { useState, useRef, forwardRef } from "react";
import {
  Button,
  Backdrop,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  ClickAwayListener
} from "@material-ui/core";
import styled from "styled-components";
import Link from "next/link";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";

import SuccessfulSignUp from "@components/Welcome/SuccessfulSignUp";
import { SignUpForm } from "@components/SignIn/SignUp";
import AFButton from "@components/Library/Button/Button";
import SignInForm from "@components/Forms/Auth/SignIn/SignIn";
import AppbarButton from "./AppbarButton";

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

function SignUpPaneHeader(props: { setPage: (pageName: string) => void }) {
  return (
    <Grid style={{ marginTop: 30 }} alignItems="center" container item xs={12}>
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
  );
}

function SignUpPane(props: {
  setOpen: (open: boolean) => void;
  setPage: (pageName: string) => void;
}) {
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
                <Grid item xs={12}>
                  <SignUpPaneHeader setPage={props.setPage} />
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
                setTimeout(() => props.setOpen(false), 1400)
              }
            />
          )}
        </AnimatePresence>
      </Grid>
    </Grid>
  );
}

function SignInPaneHeader(props: { setPage: (pageName: string) => void }) {
  return (
    <Grid container alignItems="center">
      <Grid item xs={6}>
        <Typography variant="h5">Sign in</Typography>
      </Grid>
      <Grid item container xs={6} direction="row-reverse">
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
            onClick={() => props.setPage("SignUp")}
          >
            <Typography variant="body1">Register</Typography>
          </AFButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

function SignInPane(props: { setPage: (pageName: string) => void }) {
  return (
    <Grid container style={{ minWidth: 324, padding: 6 }} direction="row">
      <Grid item xs={12}>
        <SignInPaneHeader setPage={props.setPage} />
      </Grid>
      <Grid item xs={12}>
        <SignInForm />
      </Grid>
    </Grid>
  );
}

// I am not going to learn how to type a ref. I have better things to do, and
// am not smart enough to learn it in a reasonable time. Maybe I'll find a
// youtube video of it on my way to work. This also applies to typing forwardRef
// as well.
const SignInSignUpPane = forwardRef<HTMLDivElement, any>((props, ref) => {
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
                <SignInPane setPage={setPage} />
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

export default function SignInAppbar() {
  const [open, setOpen] = useState(false);
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  // I think use backdrop fucks up the media query. It a hard corner case to reproduce but there is a flash
  // 1. open ws on full screen
  // 2. minimize to small size < md.
  // 3. Open sign in
  // 4. clos sign in, you should see a flicker. moving useMediaQuery up to the parent component of backdrop fixes it.
  const mddown = useMediaQuery((theme: any) => theme?.breakpoints.down("md"));
  return (
    <>
      <AppbarButton onClick={() => setOpen(true)} text={"Sign In"}>
        <Typography>Sign in</Typography>
      </AppbarButton>
      <Backdrop open={open} style={{ zIndex: 1, padding: 12 }}>
        {open && (
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <SignInSignUpPane setOpen={setOpen} />
          </ClickAwayListener>
        )}
      </Backdrop>
    </>
  );
}
