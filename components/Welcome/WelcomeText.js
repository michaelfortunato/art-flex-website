import { StylesProvider, Typography } from "@material-ui/core";
import { CSSTransition } from "react-transition-group";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import styles from "@styles/WelcomeText.module.css";
import Gridline from "@components/Gridline";
import theme from "theme";
import ProgressDots from '@components/Welcome/ProgressDots'
import BrushStroke from "@components/Welcome/BrushStroke"
import animationPage1 from '/public/Welcome-Page1.json'
import animationPage2 from '/public/Welcome-Page2.json'
import animationPage3 from '/public/Welcome-Page3.json'
import animationPage4 from '/public/Welcome-Page42.json'
import React from "react";




import { Brush } from "@material-ui/icons";
const animationDuration = 2000;
const blurbs = [
  {
    text: "Welcome.",
    enterTime: 1000 || animationDuration,
    exitTime: 1000 || animationDuration,
    duration: 1200,
    left: 28,
    top: 18,
    height: 50,
    width: 50,
    animationData: animationPage1
  },
  {
    text: "Art Flex is an online store for art, made with artists in mind. Thank you for considering us and our mission. ",
    enterTime: 1000 || animationDuration,
    exitTime: 1200 || animationDuration,
    duration: 3000,
    left: 12,
    top: 0,
    height: 75,
    width: 75,
    animationData: animationPage2
  },
  {
    text:
      "It is too difficult for artists to generate consistent income from their works. " +
      "Gallieries charge obscene commisions on sales. They intimiate new buyers and artists alike. " +
      "We want to change that.",
    enterTime: 1000 || animationDuration,
    exitTime: 1000 || animationDuration,
    duration: 4000,
    animationData: animationPage3,
    left: 0,
    top: 0,
    height: 100,
    width: 100
  },
  {
    text:
      "We are putting the artist first, with the goal of connecting you to as many buyers as possible through the power of the internet. ",
    enterTime: 1000 || animationDuration,
    exitTime: 1000 || animationDuration,
    duration: 2300,
  },
  {
    text:
      "Please consider signing up below to become a founding user. " +
      "Thank you.",
    enterTime: 800 || animationDuration,
    exitTime: 1000 || animationDuration,
    duration: 3000,
    animationData: animationPage4,
    left: -7,
    top: 20,
    height: 100,
    width: 100
  },
];
const AnimationContainer = styled.div`
  &.fadeIn-appear {
    opacity: 0;
  }
  &.fadeIn-appear-active {
    opacity: 1;
    transition-property: all;
    transition-duration: ${(props) => props.enterTime}ms;
    transition-delay: ${(props) => props.enterDelay}ms;
  }
  &.fadeIn-appear-done {
    opacity: 1;
  }
  &.fadeIn-enter {
    opacity: 0;
  }
  &.fadeIn-enter-active {
    opacity: 1;
    transition-property: all;
    transition-duration: ${(props) => props.enterTime}ms;
    transition-delay: ${(props) => props.enterDelay}ms;
  }
  &.fadeIn-exit {
    opacity: 1;
  }
  &.fadeIn-exit-active {
    opacity: 0;
    transition-property: all;
    transition-duration: ${(props) => props.exitTime}ms;
    transition-delay: ${(props) => props.exitDelay}ms;
  }
  &.fadeIn-exit-done {
    opacity: 0;
    transition-property: all;
  }
`;

export default function WelcomeText(props) {
  const [blurb, setBlurb] = useState(0);
  const [trigger, setTrigger] = useState(true);
  useEffect(() => setTrigger(true), [blurb]);

  const paintBrushRefs = blurbs.map(() => React.createRef(null));

  function onEntered(i, duration) {
    paintBrushRefs[i].current.play()
    setTimeout(() => setTrigger(false), duration)
  }

  function onExited() {
    if (blurb + 1 === blurbs.length) {
      props.setCurrentPage(2);
    } else {
      setBlurb(blurb + 1);
    }
  }

  const animationDuration = 2000;
  return (
    <Grid container className={styles.container}>
      <Grid item xs={12} />
      <Grid item xs={12}>
        {blurbs.map(
          ({ text, enterTime, exitTime, duration, animationData, left, top, height, width }, blurbNumber) => (
            <CSSTransition
              key={blurbNumber}
              classNames="fadeIn"
              timeout={{
                appear: enterTime,
                enter: enterTime,
                exit: exitTime,
              }}
              onEntered={() => onEntered(blurbNumber, duration)}
              onExited={onExited}
              in={blurb === blurbNumber && trigger}
              appear={blurbNumber === 0}
              unmountOnExit
            >
              <AnimationContainer
                enterTime={enterTime}
                enterDelay={0}
                exitTime={exitTime}
                exitDelay={0}
              >
                <div
                  style={{
                    "text-align": "center",
                  }}
                >
                  <Typography variant="h1">{text}</Typography>
                </div>
                <BrushStroke animationData={animationData}
                  lottieRef={paintBrushRefs[blurbNumber]}
                  left={left}
                  top={top}
                  height={height}
                  width={width}
                />
              </AnimationContainer>
            </CSSTransition>
          )
        )}
      </Grid>
      <Grid item xs={12} />
      <div className={styles.footer}>
        <div className = {styles.dotsContainer}>
        <ProgressDots currentDot={blurb} numDots={blurbs.length} />
        </div>
      </div>
    </Grid>
  );
}
