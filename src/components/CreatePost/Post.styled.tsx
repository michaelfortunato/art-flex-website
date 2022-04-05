import styled from "styled-components";
import { Grid, InputBase } from "@material-ui/core";

export const InputForm = styled(InputBase)`
  fontsize: 1rem;
  min-height: 40;
  font-style: italic;
`;

export const PostItem = styled.div`
  margin-top: 20px;
  max-width: 400px;
  // overflow-y: auto;
  //border-bottom-style: solid;
  //border-bottom-color: #000000;
  //border-width: 1px;
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

export const RevealInputStep = styled.div<{
  showBlur?: boolean;
  disableInteraction?: boolean;
}>`
  pointer-events: ${props => (props.disableInteraction ? "none" : "auto")};
  filter: ${props => (props.showBlur ? "blur(.4rem)" : "none")};
`;
