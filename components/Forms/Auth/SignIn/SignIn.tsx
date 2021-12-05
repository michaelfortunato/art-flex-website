import React, { useEffect, useState, useRef, forwardRef } from "react";
import Link from "next/link";
import { Grid, Typography, useTheme } from "@material-ui/core";
import styled from "styled-components";
import GoogleSignInButton from "@components/Buttons/GoogleSignInButton";
import FacebookSignInButton from "@components/Buttons/FacebookSignInButton";
import AuthForm, { SocialBanner } from "../AuthForm";
import axios, { AxiosResponse } from "axios";
import AFButton from "@components/Library/Button/Button";
import AFPasswordFormField from "@components/Library/FormField/Variants/PasswordFormField/PasswordFormField";
import AFBaseFormField from "@components/Library/FormField/BaseFormField";
import { useSWRConfig } from "swr";
import { ScopedMutator } from "swr/dist/types";

const GridRow = styled(Grid)`
  margin-top: 30px;
`;

function signInSuccess(res: AxiosResponse, mutate: ScopedMutator<any>) {
  mutate("/login");
}

function signInFailure(error: any, setSignUpFailed: (message: string) => void) {
  const defaultMessage =
    "Could not sign in. Website is undergoing maintenence.";
  if (axios.isAxiosError(error)) {
    setSignUpFailed(error?.response?.data?.statusMessage || defaultMessage);
  } else {
    setSignUpFailed(defaultMessage);
  }
}

function EmailSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInFailedMessage, setSignInFailedMessage] = useState("");
  const { mutate } = useSWRConfig();
  const theme = useTheme();

  useEffect(() => {
    if (signInFailedMessage !== "") setSignInFailedMessage("");
  }, [email, password]);

  return (
    <Grid>
      <GridRow item xs={12}>
        <AFBaseFormField
          type="email"
          text="Email address"
          onChange={event => setEmail(event.target.value)}
        />
      </GridRow>
      <GridRow item xs={12}>
        <AFPasswordFormField text="Password" setPassword={setPassword} />
      </GridRow>
      {signInFailedMessage !== "" && (
        <Grid item xs={12}>
          <Typography
            style={{ color: theme.palette.error.main }}
            variant="body1"
          >
            {signInFailedMessage}
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
        <AFButton
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
              .then(response => signInSuccess(response, mutate))
              .catch(error => signInFailure(error, setSignInFailedMessage))
          }
        >
          <Typography
            style={{ color: "white", textTransform: "none" }}
            variant="button"
          >
            Sign in
          </Typography>
        </AFButton>
      </GridRow>
    </Grid>
  );
}

function SocialMediaSignInForm(props: any) {
  return (
    <Grid container>
      <Grid style={{ marginTop: 12 }} item xs={12}>
        <GoogleSignInButton />
      </Grid>
      <Grid style={{ marginTop: 12 }} item xs={12}>
        <FacebookSignInButton />
      </Grid>
    </Grid>
  );
}

export default function SignInForm(props: any) {
  return (
    <AuthForm bannerMarginTop={16} bannerMarginBottom={-1}>
      <EmailSignInForm />
      <SocialMediaSignInForm />
    </AuthForm>
  );
}
