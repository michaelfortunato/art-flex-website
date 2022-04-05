import React from "react";
import styles from "@styles/WelcomeChoice.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { motion } from "framer-motion";
import styled from "styled-components";

const StyledButton = styled(Grid)`
  padding-top: 22px;
  padding-bottom: 22px;
  margin: 1rem;
  cursor: pointer;
  width: 100%;
  height: 100%;
  text-align: center;
  color: #673ab7;
  border: 2px #673ab7 solid;
  border-radius: 12px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
`;
function Button(props) {
  return (
    <StyledButton
      xs={10}
      md={6}
      component={motion.div}
      whileHover={{
        scale: 1.1,
        borderColor: "#ffffff",
        backgroundColor: "#673ab7",
        color: "#ffffff",
      }}
      item
      onClick={() => props.setNextPage(props.pageNumber)}
    >
      <Typography variant="button">{props.text}</Typography>
    </StyledButton>
  );
}
export default function WelcomeChoice(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ x: "-150%", transition: { duration: ".25" } }}
    >
      <div >
        <Typography variant="h4">Are you an artist or a buyer?</Typography>
      </div>
      <Grid container justifyContent="space-around" style={{marginTop: "4rem" }}>
        <Button
          setNextPage={props.setCurrentPage}
          pageNumber={2}
          text={"I am an artist"}
        />
        <Button
          setNextPage={props.setCurrentPage}
          pageNumber={3}
          text={"I am a buyer"}
        />
      </Grid>
    </motion.div>
  );
}
