import React from "react";
import GoogleLogin, { useGoogleLogin } from "react-google-login";
import SignInButton from "./SignInButton";

export default function GoogleSignInButton() {
  return (
    <SignInButton
      isSVG={true}
      icon={"/facebook_logo.svg"}
      text={"Sign in with Facebook"}
    />
  );
}
