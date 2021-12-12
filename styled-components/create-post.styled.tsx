import styled from "styled-components";
import { motion } from "framer-motion";
import { Grid as MuiGrid } from "@material-ui/core";

export const AFButton = styled(motion(MuiGrid))`
  position: relative;
  width: 100%;
  padding: 10px;
  border-radius: 24px;
  border-color: #222222;
  border-width: 2px;
  border-style: solid;
`;
