import styled from "styled-components";
import { Grid, InputBase } from "@material-ui/core";

export const InputForm = styled(InputBase)`
  fontsize: 1rem;
  min-height: 40;
  font-style: italic;
`;

export const InputContainer = styled.div`
  margin-top: 20px;
  border-bottom-style: solid;
  border-bottom-color: #000000;
`;

export type TagVariants = "period" | "social" | "prominence";

export const Tag = styled.span<{
  variant: TagVariants;
}>`
  display: inline-block;
  margin: 4px;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 20px;
  opacity: 0.8;
  background-color: ${props => props.theme.tag[props.variant].backgroundColor};
  color: ${props => props.theme.tag[props.variant].textColor};
`;

export const RevealInputStep = styled(Grid)<{
  showBlur?: boolean;
}>`
  filter: ${props => (props.showBlur ? "blur(.2rem)" : "none")};
`;
