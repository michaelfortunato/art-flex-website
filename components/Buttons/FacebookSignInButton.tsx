import React from "react";
import SignInButton from "./SignInButton";

export default function GoogleSignInButton(props: { text?: string }) {
  return (
    <SignInButton
      isSVG={true}
      icon={"/facebook_logo.svg"}
      text={props.text || "Sign in with Facebook"}
    />
  );
}
