import { Typography } from "@material-ui/core";
import * as Styled from "./AppbarButton.styled";

function AppbarButton(props: any) {
  return (
    <Styled.AppbarButton onClick={props.onClick}>
      <Typography variant={props.variant}>{props.text}</Typography>
    </Styled.AppbarButton>
  );
}
