import React from "react";
import styled from "styled-components";
import { ButtonBase, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
/*  padding-left: 18px;
    padding-right: 18px;
    padding-top: 12px;
    padding-bottom: 12px;
    */

const StyledButton = styled(motion(ButtonBase))`
  position: relative;
  width: 100%;
  padding: 10px;
  border-radius: 24px;
  border-color: #222222;
  border-width: 2px;
  border-style: solid;
`;
const StyledIconArea = styled.div`
  display: inline-block;
  margin-left: 8px;
  margin-right: 10px;
`;
const StyledIconComp = styled.i`
  vertical-align: middle;
  height: 25px;
  width: 25px;
`;

const StandardButton = ({ children, ...props }: any) => (
  <StyledButton
    whileHover={
      props.animate && {
        scale: 1.05,
        ...props.animateTo
      }
    }
    onClick={props.onClick}
    style={{ ...props.styleOverrides }}
  >
    {children}
  </StyledButton>
);

function SocialButton(props: any) {
  return (
    <StandardButton
      onClick={props.onClick}
      animate={props.animate}
      animateto={props.animateTo}
      styleOverrides={props.styleOverrides}
    >
      <StyledIconArea>
        {props.isSVG ? (
          <img
            style={{
              verticalAlign: "middle",
              height: "1.5rem",
              width: "1.5rem"
            }}
            src={props.icon}
          />
        ) : (
          <StyledIconComp as={props.icon} />
        )}
      </StyledIconArea>
      <Typography style={{ textTransform: "none" }} variant="button">
        {props.text}
      </Typography>
    </StandardButton>
  );
}

export { StandardButton, SocialButton };
export default function SignInButton(props: any) {
  return (
    <StyledButton
      whileHover={{
        scale: 1.05,
        ...props.animateTo
      }}
      onClick={props.onClick}
    >
      <StyledIconArea>
        {props.isSVG ? (
          <img
            style={{
              verticalAlign: "middle",
              height: "1.5rem",
              width: "1.5rem"
            }}
            src={props.icon}
          />
        ) : (
          <StyledIconComp as={props.icon} />
        )}
      </StyledIconArea>
      <Typography style={{ textTransform: "none" }} variant="button">
        {props.text}
      </Typography>
    </StyledButton>
  );
}
