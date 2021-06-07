import { StylesProvider, Typography } from "@material-ui/core";
import { CSSTransition } from "react-transition-group";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid"
import styles from "@styles/WelcomeText.module.css"
const blurbs = [
  {
    blurbNumber: 0,
    text: [
      "Welcome. Art Flex is an online store for art, made with artists in mind. Thank you for considering us and our mission.",
    ],
    duration: 2000,
  },
  {
    blurbNumber: 1,
    text: [
      "It is too difficult for artists to generate consistent income from their works.",
      "Gallieries charge obscene commisions on sales, and they intimiate new buyers and artists alike.",
      "We want to change that.",
    ],
    duration: 1000,
  },
]
/*
  {
    blurbNumber: 2,
    text: [
      "We want to democratize how artists find their fans, and how people discover art.",
    ],
    duration: 2000,
  },
  {
    blurbNumber: 3,
    text: [
      "Art Flex is an online store for art, and we want to do it right.",
      "We are putting the artist first, with the goal of connecting you to as many buyers as possible, and to growing your popularity through the power of the internet.",
    ],
    duration: 2000,
  },
  {
    blurbNumber: 4,
    text: [
      "We need your help to get this right, and we can use all the advice available.",
      "Please consider signing up below to become a founding user.",
      "Thank you.",
    ],
    duration: 2000,
  },
];
*/
const AnimationContainer = styled.div`
  position: absolute;

  &.fadeIn-appear {
    opacity: 0;
  }
  &.fadeIn-appear-active {
    opacity: 1;
    transition-property: all;
    transition-duration: ${(props) => props.animationDuration}ms;
    transition-delay: ${(props) => props.enterDelay}ms;
  }
  &.fadeIn-appear-done {
      opacity: 1
  }
  &.fadeIn-enter {
    opacity: 0;
  }
  &.fadeIn-enter-active {
    opacity: 1;
    transition-property: all;
    transition-duration: ${(props) => props.animationDuration}ms;
    transition-delay: ${(props) => props.enterDelay}ms;
  }
  &.fadeIn-exit {
    opacity: 1;
  }
  &.fadeIn-exit-active {
    opacity: 0;
    transition-property: all;
    transition-duration: ${(props) => props.animationDuration}ms;
    transition-delay: ${(props) => props.exitDelay}ms;
  }
  &.fadeIn-exit-done {
    opacity: 0;
    transition-property: all;
    transition-duration: ${(props) => props.animationDuration}ms;
    transition-delay: ${(props) => props.exitDelay}ms;
  }
`;

export default function WelcomeText(props) {
  const [blurb, setBlurb] = useState(0);

  const animationDuration = 500;
  /*useEffect(() => {
      setBlurb(1)
  }, [])*/
  return (
    <div>
      <Grid container className = {styles.container}>
        <Grid item xs={12} />
        <Grid item xs={12} style = {{"position":"relative"}}>
          {blurbs.map(({ blurbNumber, text, duration }) => {
            console.log(blurb);
            return (
              <CSSTransition
                key={blurbNumber}
                classNames="fadeIn"
                timeout = {{
                    appear: animationDuration, 
                    enter: blurbNumber !== 0 ? blurbs[blurbNumber -1].duration + animationDuration : animationDuration,
                    exit: animationDuration + duration
                }}
                onEntered={() => setBlurb(blurb + 1)}
                onExited={() => {
                  if (blurb === blurbs.length) {
                    //return props.setCurrentPage(2);
                  }
                }}
                in={blurb == blurbNumber}
                appear={blurbNumber === 0}
                unmountOnExit
              >
                <AnimationContainer
                  animationDuration={animationDuration}
                  enterDelay={
                    blurbNumber > 0 ? blurbs[blurbNumber - 1].duration : 0
                  }
                  exitDelay={duration}
                >
                  <Typography variant="h1">{text[0]}</Typography>
                </AnimationContainer>
              </CSSTransition>
            );
          })}
        </Grid>
        <Grid item xs={12} />
      </Grid>
    </div>
  );
}