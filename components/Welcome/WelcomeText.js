import { makeStyles, StylesProvider, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { CSSTransition } from "react-transition-group";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import styles from "@styles/WelcomeText.module.css";
import Gridline from "@components/Gridline";
import theme from "theme";
import ProgressDots from "@components/ProgressDots";
import BrushStroke from "@components/Welcome/BrushStroke";
import animationPage1 from "/public/Welcome-Page1.json";
import animationPage2 from "/public/Welcome-Page2.json";
import animationPage3 from "/public/Welcome-Page3.json";
import animationPage4 from "/public/Welcome-Page42.json";
import React from "react";
import { motion, useAnimation } from "framer-motion";

const configurations = {
  1: {
    nextPage: 4,
    lineSize: "h5",
    lines: [
      "Posting your Art is easy!",
      "Set up your artist profile",
      "Upload pictures of your artwork",
      "Set your price and rental period",
      "We help you ship your art when it's been rented",
    ],
    animationData: {
      initial: {},
      animate: {
        transition: {
          delayChildren: .1,
          staggerChildren: .7,
        },
      },
    },
    topSentenceAnimationData: {
      initial: { x: "150vh" },
      animate: {
        x: "0",
        transition: {
          type: "spring",
          duration: 0.7,
        },
      },
    },
    childrenAnimationData: {
      initial: { x: "150vh" },
      animate: {
        x: "0",
        transition: {
          type: "spring",
          duration: 0.7,
        },
      },
    },
    lottieData: {
      lottieAnimationDelay: 100,
      lottieAimationData: animationPage2,
      left: -7,
      top: 20,
      height: 100,
      width: 100,
    },
  },
  2: {
    lineSize: "h5",
    lines: [
      "Renting Art is easy!",
      "Set up your profile",
      "Browse and search for art that you love",
      "Choose and rent a piece in as little as 2 clicks",
    ],
    animationData: {
      initial: {},
      animate: {
        transition: {
          delayChildren: 0,
          staggerChildren: 0.6,
        },
      },
    },
    topSentenceAnimationData: {
      initial: { x: "150vh" },
      animate: {
        x: "0",
        transition: {
          type: "spring",
          duration: 0.7,
        },
      },
    },
    childrenAnimationData: {
      initial: { x: "150vh" },
      animate: {
        x: "0",
        transition: {
          type: "spring",
          duration: 0.7,
        },
      },
    },
    lottieData: {
      lottieAnimationDelay: 100,
      lottieAimationData: animationPage2,
      left: -7,
      top: 20,
      height: 100,
      width: 100,
    },
  },
};

const buttonAnimationData = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1 } },
};

function Button(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Grid
      component={motion.div}
      whileHover={{
        scale: 1.1,
        textShadow: "0px 0px 8px #673ab7",
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
        <Typography variant="button">
          {props.text}
        </Typography>
      </Grid>
    </Grid>
  );
}
/*
fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif"
fontSize: "2.375rem"
fontWeight: 300
letterSpacing: "-0.00833em"
lineHeight: 1.2
*/
const useStyles = makeStyles(theme => ({
  h2: {
    fontSize: "2rem",
  }
}));


export default function WelcomeText(props) {
  const theme = useTheme()
  const [topSentenceDone, setTopSentenceDone] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"))
  const isLaptop = useMediaQuery(theme.breakpoints.down("lg"))
  const classes = useStyles();
  const controlsText = useAnimation();
  const controlsButton = useAnimation();
  console.log(theme)
  useEffect(async () => {
  }, [controlsText, controlsButton]);

  let artistText = configurations[1].lines.map((line, i) => {
    if (i === 0) {
      return (
        <Grid
          initial="initial"
          animate="animate"
          variants={configurations[props.configurationNumber].topSentenceAnimationData}
          className={styles.textLineHeader}
          component={motion.div}
          item
          key={i}
          xs={12}
          onAnimationComplete={async () => {
            await controlsText.start("animate")
            await controlsButton.start("animate")
          }
          }
        >
          <Typography variant="h2" style={{ display: "inline" }}>
            Posting your </Typography>
          <Typography variant="h2" style={{ display: "inline", color: theme.palette.primary.main }}>art </Typography>
          <Typography variant="h2" style={{ display: "inline" }}>
            is easy </Typography>
        </Grid>
      )
    }
    else {
      return (
        <Grid
          style={i === 4 ? { marginTop: "2rem" } : null}
          className={styles.textLine}
          component={motion.div}
          item
          key={i}
          variants={
            configurations[props.configurationNumber].childrenAnimationData
          }
          xs={12}
          onAnimationComplete={(defintion) =>
            console.log(`Animation ${i} completed!`, defintion)
          }
        >
          <Typography variant="h4" classes={{ h2: classes.h2 }} >
            {line}
          </Typography>
        </Grid>)
    }
  });
  let buyerText = configurations[2].lines.map((line, i) => {
    if (i === 0) {
      return (
        <Grid
          initial="initial"
          animate="animate"
          variants={configurations[props.configurationNumber].topSentenceAnimationData}
          className={styles.textLineHeader}
          component={motion.div}
          item
          key={i}
          xs={12}
          onAnimationComplete={async () => {
            await controlsText.start("animate")
            await controlsButton.start("animate")
          }
          }
        >
          <Typography variant="h2" style={{ display: "inline" }}>
            Renting art is </Typography>
          <Typography variant="h2" style={{ display: "inline", color: theme.palette.primary.main }}>easy</Typography>
        </Grid>
      )
    }
    else {
      return (
        <Grid
          className={styles.textLine}
          component={motion.div}
          item
          key={i}
          variants={
            configurations[props.configurationNumber].childrenAnimationData
          }
          xs={12}
          onAnimationComplete={(defintion) =>
            console.log(`Animation ${i} completed!`, defintion)
          }
        >
          <Typography variant="h4" classes={{ h2: classes.h2 }} >
            {line}
          </Typography>
        </Grid>)
    }
  });





  return (
    <motion.div exit={props.exitAnimation}>
      <Grid
        component={motion.div}
        variants={configurations[props.configurationNumber].animationData}
        initial="initial"
        animate={controlsText}
        container
        justify="center"
        spacing={0}
      >
        {props.configurationNumber === 1 ? artistText : buyerText}
        <Grid
          className={styles.buttonContainer}
          component={motion.div}
          variants={buttonAnimationData}
          initial="initial"
          animate={controlsButton}
          item
          lg={4}
          md={8}
          xs={10}
        >
          <Button
            text={"Finish your sign up"}
            setNextPage={props.setCurrentPage}
            pageNumber={props.nextPageNumber}
          />
        </Grid>
      </Grid>
    </motion.div >
  );
}
