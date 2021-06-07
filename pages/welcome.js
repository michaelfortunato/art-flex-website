import { Grid, Typography } from "@material-ui/core";
import styles from "@styles/WelcomePage.module.css";
import ProgressBar from "@components/ProgressBar";
import { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import WelcomeStart from "@components/Welcome/WelcomeStart";
import WelcomeText from "@components/Welcome/WelcomeText"
import SignUp from '@components/SignIn/SignUp'
const AnimationContainer = styled.div`
  &.fadeIn-appear {
    opacity: 0;
  }
  &.fadeIn-appear-active {
    opacity: 1;
    transition: all 700ms;
  }
  &.fadeIn-enter {
    opacity: 0;
  }
  &.fadeIn-enter-active {
    opacity: 1;
    transition: all 700ms;
  }
  &.fadeIn-exit {
    opacity: 1;
  }
  &.fadeIn-exit-active {
    opacity: 0;
    transition: all 700ms;
  }
  &.fadeIn-exit-done {
    opacity:0;
  }
`;

const pages = [
  { number: 0, pageName: "WelcomeStart", Component: WelcomeStart },
  { number: 1, pageName: "WelcomeText", Component: WelcomeText},
  {number: 2, pageName: "SignUpForm", Component: SignUp}
];

export default function WelcomePage() {
  const [startProgressBar, setStartProgressBar] = useState(false);
  const [isProgressBarDone, setIsProgressBarDone] = useState(false);
  const [componentIsDone, setComponentIsDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [entered, setEntered] = useState(false)

  return (
    <div className={styles.WelcomePage}>
      {pages.map(({ number, pageName, Component }) => 
        <CSSTransition
          key = {number}
          classNames="fadeIn"
          timeout={700}
          appear={number == 0}
          in={currentPage == number}
          unmountOnExit
        >
          <AnimationContainer>
            <Component initialDelay = {2000} setCurrentPage = {setCurrentPage}/> 
          </AnimationContainer>
        </CSSTransition>
      )}
    </div>
  );
}
