import { useState, useEffect, useRef } from "react";
import styles from "@styles/WelcomeStart.module.css";
import ProgressBar from "@components/ProgressBar";
import Gridline from "@components/Gridline";
import { Grid, Typography, useTheme } from "@material-ui/core";
import Lottie from "lottie-react";
import BrushStroke from "./BrushStroke";
import animationPage1 from "/public/Welcome-Page1.json";
import { motion } from "framer-motion";

export default function WelcomeStart(props) {
  const [trigger, settrigger] = useState(true)
  const lottieRef = useRef();
  setTimeout(() => props.setCurrentPage(1), props.duration ? props.duration : 1000)
  return (
    <motion.div exit = {{opacity: 0}}> 
      <Grid style = {{position: "relative", paddingTop: "10%"}} container alignItems="center">
        <Grid item xs = {12} style={{textAlign: "center" }}>
          <Typography style = {{"position": "relative"}}variant="h2">Welcome
        </Typography>
        </Grid>
      </Grid>
    </motion.div>
  );
}
