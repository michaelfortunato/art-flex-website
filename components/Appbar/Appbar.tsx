import React, { useState, useRef } from "react";
import {
  Divider,
  Grid,
  Hidden,
  Menu,
  Popper,
  Typography
} from "@material-ui/core";
import Searchbar from "@components/Searchbar";
import Navigation from "@components/Appbar/Navigation";
import styled from "styled-components";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
const pages = [
  {
    url: "/art",
    name: "Art"
  },
  {
    url: "/about",
    name: "About"
  },
  {
    url: "/about",
    name: "About"
  },
  {
    k: 9,
    url: "/about",
    name: "About"
  }
];
const StyledMenubar = styled(Grid)`
  margin-top: -10px;
`;
export default function Appbar(props) {
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [underlinePos, setUnderlinePos] = useState({
    left: 0,
    width: 0
  });
  const parentBoxRefs = pages.map(() => useRef(null));

  const underlineRef = useRef(null);
  const underlineTimer = useRef(null);
  const greybarRef = useRef(null);
  const onMouseOver = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    boxIndex: number
  ) => {
    underlineTimer.current &&
      clearTimeout(underlineTimer.current as NodeJS.Timeout);
    //event.target.getBoundingClientRect(); // use event.target.getBoundingClientRect() if you dont want the whole box
    const textPos = parentBoxRefs[boxIndex].current.getBoundingClientRect();

    greybarRef?.current &&
      setUnderlinePos({
        left: textPos.x - greybarRef.current.getBoundingClientRect().x,
        width: textPos.width
      });
    setIsUnderlined(true);
    /*
        if (isUnderlined === false) {
            prevIsUnderlined(false)
        }
        setIsUnderlined(true);
        */
  };
  const onMouseOut = () => {
    setIsUnderlined(false);
  };

  return (
    <div
      ref={props.appbarRef}
      style={{ paddingTop: 10, marginBottom: 40, backgroundColor: "white" }}
    >
      <Grid container alignItems="center">
        <Grid container item xs={12} alignItems="center" spacing={3}>
          <Grid item xs="auto">
            <div>
              <Typography variant="h1">AF</Typography>
            </div>
          </Grid>
          <Hidden smDown>
            <Grid item xs>
              <Searchbar />
            </Grid>
          </Hidden>
          <Grid item xs md="auto">
            <Navigation />
          </Grid>
        </Grid>
        <StyledMenubar container item xs={12} justifyContent="space-around">
          {pages.map(({ url, name }, index) => (
            <Grid
              ref={parentBoxRefs[index]}
              style={{ textAlign: "", padding: 15, cursor: "pointer" } as any}
              key={index}
              item
              xs
              onMouseLeave={onMouseOut}
              onMouseOver={event => onMouseOver(event, index)}
            >
              <Link href={url}>
                <Typography variant="button">
                  <a>{name}</a>
                </Typography>
              </Link>
            </Grid>
          ))}
        </StyledMenubar>
        <Grid
          ref={greybarRef}
          item
          xs={12}
          style={{ height: 2, backgroundColor: "#dedede" }}
        >
          <div style={{ position: "relative", height: "100%" }}>
            <AnimatePresence>
              {isUnderlined && (
                <motion.span
                  exit={{ scaleX: 0, transformOrigin: "50% 50%" }}
                  initial={{ width: 0 }}
                  animate={{
                    width: underlinePos.width,
                    left: underlinePos.left
                  }}
                  style={{
                    transformOrigin: "50% 50%",
                    scaleX: 1.1,
                    position: "absolute",
                    display: "inline-block",
                    left: underlinePos.left,
                    height: "100%",
                    width: underlinePos.width,
                    backgroundColor: "black"
                  }}
                />
              )}
            </AnimatePresence>
            <span
              style={{
                position: "absolute",
                display: "inline-block",
                left: underlinePos.left,
                width: underlinePos.width
              }}
              ref={underlineRef}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
