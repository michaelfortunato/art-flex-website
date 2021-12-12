import styled from "styled-components";
import { motion } from "framer-motion";
import { ButtonBase, InputBase } from "@material-ui/core";

export const InputDescription = styled(motion(ButtonBase))`
  maxheight: 200;
  overflowy: "auto";
  margintop: 20;
  borderbottomstyle: "solid";
  borderbottomcolor: "#000000";
`;
export const InputDescriptionForm = styled(InputBase)`
  fontsize: "1rem";
  minheight: 40;
  fontstyle: "italic";
`;
