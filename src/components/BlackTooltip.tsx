import styled from "styled-components";
import { Tooltip, TooltipProps } from "@material-ui/core";

const BlackTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .MuiTooltip-tooltip {
    background-color: #000000;
    font-size: ${props => props.theme.typography.body1.fontSize};
  }
  & .MuiTooltip-arrow {
    background-color: #000000;
  }
`;
export default BlackTooltip;
