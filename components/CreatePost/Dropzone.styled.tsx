import styled from "styled-components";
import { motion } from "framer-motion";

function getBorderColorOnDrop(
  isDragAccept: boolean,
  isDragReject: boolean,
  isDragActive: boolean
) {
  if (isDragAccept) {
    return "#00e676";
  }
  if (isDragReject) {
    return "#ff1744";
  }
  if (isDragActive) {
    return "#2196f3";
  }
  return "#eeeeee";
}

export const DropzoneContainer = styled(motion.div)<any>`
  border-style: dashed;
  border-width: 2px;
  border-color: ${({ isDragAccept, isDragReject, isDragActive }) =>
    getBorderColorOnDrop(isDragAccept, isDragReject, isDragActive)};
  outline: none;
  height: 100%;
  position: relative;
`;

export const OverlayContainer = styled(motion.div)`
  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  color: #ffffff;
  opacity: 0;
`;
