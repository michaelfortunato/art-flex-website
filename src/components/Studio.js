import React, { useState } from "react";
import { Grid, Divider, Typography, Paper } from "@material-ui/core";
import styled from "styled-components";
import useSWR from "swr";
import { AnimatePresence, motion } from "framer-motion";
import StoreTile, { StyledTile as StoreStyledTile } from "./Store/StoreTile";

const StudioStyledTile = styled(motion(StoreStyledTile))``;

const AddIcon = (props) => (
  <svg
    className="MuiSvgIcon-root"
    focusable="false"
    viewBox="0 0 24 24"
    style={{ height: props.height, width: props.width, color: props.color }}
    aria-hidden="true"
  >
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
  </svg>
);

const AnimatedGrid = motion(Grid);
const AnimatedPaper = motion(Paper);
const tiles = [...Array(10).keys()];
export default function Studio() {
  // const { data, error } = useSWR("/account/studio/upload");
  const [leavingPage, setLeavingPage] = useState(false);
  console.log(tiles);
  return (
    <AnimatePresence>
      {!leavingPage && (
        <Grid container direction="row" spacing={2}>
          <Grid onClick={() => setLeavingPage(true)} key={-1} item xs="auto">
            <AnimatedPaper
              whileHover={{
                scale: 1.1,
              }}
              style={{ borderRadius: 10, display: "inline-block" }}
              elevation={5}
            >
              <div style={{ textAlign: "center", padding: 40 }}>
                <AddIcon height={"100px"} width={"100px"} color="grey" />
              </div>
              <div>
                <Divider />
              </div>
              <div style={{ textAlign: "center", padding: 40 }}>
                <Typography variant="h6">
                  Post a piece of art to sell
                </Typography>
              </div>
            </AnimatedPaper>
          </Grid>
          {tiles.map((_, index) => (
            <Grid key={index} item xs="auto">
              <AnimatedPaper
                whileHover={{
                  scale: 1.1,
                }}
                style={{ borderRadius: 10, display: "inline-block" }}
                elevation={5}
              >
                <div style={{ textAlign: "center", padding: 40 }}>
                  <AddIcon height={"100px"} width={"100px"} color="grey" />
                </div>
                <div>
                  <Divider />
                </div>
                <div style={{ textAlign: "center", padding: 40 }}>
                  <Typography variant="h6">
                    Post a piece of art to sell
                  </Typography>
                </div>
              </AnimatedPaper>
            </Grid>
          ))}
        </Grid>
      )}
    </AnimatePresence>
  );
}
