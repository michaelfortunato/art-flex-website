import React from "react";
import styles from "@styles/WelcomeChoice.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { motion } from "framer-motion";


function Button(props) {
  return (
    <Grid
      xs = {10}
      component={motion.div}
      whileHover={{
        scale: 1.1,
        borderColor: "#ffffff",
        backgroundColor: "#673ab7",
        color: "#ffffff",
      }}
      container
      item
      alignItems="center"
      className={styles.button}
      onClick={() => props.setNextPage(props.pageNumber)}
    >
      <Grid item xs={12}>
        <Typography variant="button" >{props.text}</Typography>
      </Grid>
    </Grid>
  );
}
export default function WelcomeChoice(props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ x: "-150%", transition: { duration: ".25" } }}
    >
      <Grid style = {{position: "relative", paddingTop: "10%"}} container alignItems = "center">
        <Grid item xs={12} className={styles.header}>
          <Typography variant="h4">Are you an artist or a buyer?</Typography>
        </Grid>
      </Grid>
      <Grid
        container
        justify="center"
        style = {{marginTop: "4rem"}}
      >
        <Grid container item justify = "center" xs={10} sm={8} md={5} lg={3} className={isMobile ? styles.buttonContainerSmallScr : styles.buttonContainerLargeScr}>
          <Button
            setNextPage={props.setCurrentPage}
            pageNumber={2}
            text={"I am an artist"}
          />
        </Grid>
        <Grid container item justify = "center" xs={10} sm={8} md={5} lg={3} className={isMobile ? styles.buttonContainerSmallScr : styles.buttonContainerLargeScr}>
          <Button
            setNextPage={props.setCurrentPage}
            pageNumber={3}
            text={"I am a buyer"}
          />
        </Grid>
      </Grid>
    </motion.div>
  );
}
