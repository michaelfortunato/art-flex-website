import React, { useState, useEffect } from "react";
import styles from "@styles/ProgressBar.module.css";
import { ProgressBar as fuiwProgressBar } from "@ramonak/react-progress-bar";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  makeStyles,
  StylesProvider,
  withStyles,
} from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 12,
    borderRadius: 6,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 12,
    backgroundColor: theme.palette.primary.main,
  },
}))(LinearProgress);

const easeInOutSine = (x) => 1 - Math.cos((x * Math.PI) / 2);

const duration = 70;
export default function ProgressBar(props) {
  const [tick, setTick] = useState(0);
  const [progress, setProgress] = useState(0);
  console.log(progress)
  useEffect(() => {
    if (props.startAnimation && progress < 100) {
      setTimeout(() => {
        setTick(tick + 1);
        setProgress(100 * easeInOutSine((tick + 1) / duration));
      },10);
    }
  }, [tick, props.startAnimation]);

  const filler = {
    backgroundColor: "red",
    height: "40px",
    borderRadius: "50px",
    position: "absolute",
    margin: "0px",
    padding: "0px",
    width: `${props.progress}%`,
    "z-index": "1",
  }
  if (progress >= 100) {
    props.setIsProgressBarDone(1);
  }
  return (
    <div className={styles.barContainer}>
      <BorderLinearProgress
        variant="determinate"
        value={progress < 100 ? progress : 100}
      />
      <br />
      <Typography>{progress < 100 ? progress: 100}%</Typography>
    </div>
  );
}
