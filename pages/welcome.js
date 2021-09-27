import {
  Container,
  createMuiTheme,
  Divider,
  Grid,
  MuiThemeProvider,
  Typography,
} from "@material-ui/core";
import styles from "@styles/WelcomePage.module.css";
import ProgressBar from "@components/ProgressBar";
import { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import styled, { ThemeProvider } from "styled-components";
import WelcomeStart from "@components/Welcome/WelcomeStart";
import WelcomeText from "@components/Welcome/WelcomeText";
import WelcomeChoice from "@components/Welcome/WelcomeChoice";
import WelcomeSignUp from "@components/Welcome/WelcomeSignUp";
import ProgressDots from "@components/ProgressDots";
import animationPage1 from "/public/Welcome-Page1.json";
import animationPage2 from "public/Welcome-Page42.json";
import { motion, AnimatePresence } from "framer-motion";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { responsiveFontSizes } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core";
import { useMediaQuery } from "@material-ui/core";
import MainLogo from "../public/MainLogo.svg";
import React from "react";

const StyledWelcomeSignUp = (props) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <WelcomeSignUp {...props} />
  </motion.div>
);

const pages = [
  { Component: WelcomeStart },
  { Component: WelcomeChoice },
  {
    Component: WelcomeText,
    configurationNumber: 1,
    nextPageNumber: 4,
    exitAnimation: { x: "-150%", transition: { duration: ".25" } },
  },
  {
    Component: WelcomeText,
    configurationNumber: 2,
    nextPageNumber: 4,
    exitAnimation: { x: "-150%", transition: { duration: ".25" } },
  },
  { Component: StyledWelcomeSignUp },
];

const exitAnimation = {
  opacity: 0,
};
const StyledWelcomeRoot = styled(motion.div)`
  overflow-x: hidden;
`;
const StyledMobileHeader = styled(motion.div)`
  text-align: center;
  height: 10%;
  width: 100%;
`;
const StyledDesktopHeader = styled(motion.div)`
  text-align: center;
  height: 10vh;
  width: 100%;
`;
const StyledFooter = styled.div`
  height: 10vh;
`
export default function WelcomePage() {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const WelcomeTheme = responsiveFontSizes(
    createMuiTheme({
      ...theme,
      typography: {
        button: {},
      },
    })
  );

  return (
    <MuiThemeProvider theme={WelcomeTheme}>
      <StyledWelcomeRoot initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Container maxWidth="lg">
          <AnimatePresence exitBeforeEnter>
            <AnimatePresence key={1}>
              <StyledDesktopHeader exit={{ opacity: 0 }}>
                <div onClick = {()=>setCurrentPage(0)} style={{ height: "100%" }}>
                  <MainLogo weight="100%" height="100%"/>
                </div>
                <Divider style={{ marginTop: "0.0rem" }} />
              </StyledDesktopHeader>
            </AnimatePresence>
            <AnimatePresence key={2} exitBeforeEnter>
              <div style = {{height:"80vh"}}>
              {pages.map(
                ({ Component, ...props }, pageNumber) =>
                  currentPage === pageNumber && (
                    <Component
                      key={pageNumber}
                      setCurrentPage={setCurrentPage}
                      {...props}
                    />
                  )
              )}
              </div>
            </AnimatePresence>
            <StyledFooter>
                <ProgressDots
                  currentDot={currentPage}
                  numDots={pages.length - 1}
                />
            </StyledFooter>
          </AnimatePresence>
        </Container>
      </StyledWelcomeRoot>
    </MuiThemeProvider>
  );
}
