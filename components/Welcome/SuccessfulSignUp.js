import { Typography, useTheme } from "@material-ui/core";
import React from "react";
import CheckCircleGreen from "../../public/check-circle-green.svg";
export default function SuccessfulSignUp(props) {
  const theme = useTheme();
  return (
    <div style = {{textAlign:"center"}}>
      <CheckCircleGreen
        height="100%"
        width={props.isMobile ? "200px" : "400px"}
        fill={theme.valid.color}
      />
      <Typography variant="h2">Thanks for signing up {props.name}</Typography>
      <Typography variant="h2">A verification email has been sent to {props.email} to confirm your account</Typography>
    </div>
  );
}
