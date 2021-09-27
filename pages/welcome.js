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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.root}
      >
        <Container maxWidth="lg">
          <AnimatePresence exitBeforeEnter>
            {currentPage !== 5 ? (
              <motion.div exit={{ opacity: 0 }}>
                <div style={{ minHeight: "65vh" }}>
                  <AnimatePresence>
                    {currentPage != 4 && (
                      <motion.div
                        exit={{ opacity: 0 }}
                        className={
                          isMobile ? styles.mobileHeader : styles.header
                        }
                      >
                        <img
                          src={"MainLogo.svg"}
                          className={styles.logo}
                          onClick={() => setCurrentPage(0)}
                        />
                        <Divider style={{ marginTop: ".75rem" }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence exitBeforeEnter>
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
                  </AnimatePresence>
                </div>
                <div className={styles.footer}>
                  <div className={styles.dotsContainer}>
                    <ProgressDots
                      currentDot={currentPage}
                      numDots={pages.length - 1}
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Container>
      </motion.div>
    </MuiThemeProvider>
  );
}
