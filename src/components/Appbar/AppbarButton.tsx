import { Typography } from "@material-ui/core";
import * as Styled from "./AppbarButton.styled";

export default function AppbarButton(props: any) {
  return (
    <Styled.AFAppbarButton onClick={props.onClick}>
      <Typography variant={props.variant}>{props.text}</Typography>
    </Styled.AFAppbarButton>
  );
}
