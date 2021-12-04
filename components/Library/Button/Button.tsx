import { ReactElement, ChangeEventHandler } from "react";
import CSS from "csstype";
import * as Styled from "./StandardButton.styled";

type ButtonProps = {
  children: ReactElement;
  animate: Boolean;
  animateTo?: {
    boxShadow?: string;
    scale?: 1.02;
  };
  styleOverrides?: CSS.Properties;
  onClick: () => void;
};

const StandardButton = (props: ButtonProps) => (
  <Styled.StandardButton
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
  </Styled.StandardButton>
);
