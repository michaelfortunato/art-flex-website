import { ReactElement, ChangeEventHandler } from "react";
import CSS from "csstype";
import * as Styled from "./Button.styled";
import { ButtonBaseProps } from "@material-ui/core";

interface AFButtonProps extends ButtonBaseProps {
  children: ReactElement;
  animate?: Boolean;
  animateTo?: {
    boxShadow?: string;
    scale?: 1.02;
  };
  styleOverrides?: CSS.Properties;
}

export default function AFButton(props: AFButtonProps) {
  return (
    <Styled.AFButton
      whileHover={
        props.animate && {
          scale: 1.05,
          ...props.animateTo
        }
      }
      onClick={props.onClick}
      style={{ ...props.styleOverrides }}
    >
      {props.children}
    </Styled.AFButton>
  );
}
