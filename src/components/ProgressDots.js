import React from "react";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import { Grid, useTheme } from "@material-ui/core";
import { motion } from "framer-motion";
const DotsContainer = styled(motion.span)``;
const Dot = styled(motion.div)`
  ${({ theme }) => `
	display: inline-block;
	border: 1px grey solid;
	backgroundColor: white;
	border-radius: 50%;
	width: .75rem;
	height: .75rem;

	margin-left: 1rem;
	margin-right: 1rem;
	`}
`;
export default function ProgressDots(props) {
  const theme = useTheme();
  return (
    <Grid container justifyContent="center">
      <Grid item>
        {[...Array(props.numDots)].map((_, ithDot) => (
          <Dot
            key={ithDot}
            animate={
              props.currentDot >= ithDot
                ? {
                    backgroundColor: theme.palette.primary.main,
			border: `1px ${theme.palette.primary.main} solid`
                  }
                : null
            }
          />
        ))}
      </Grid>
    </Grid>
  );
}
