import React from 'react'
import styles from "@styles/WelcomeStart.module.css";
import ProgressBar from "@components/ProgressBar";
import { useState, useEffect } from "react";
import Gridline from '@components/Gridline';
import { useTheme } from '@material-ui/core';
import Lottie from 'lottie-react'
import animationData from '/public/animationData.json'


export default function WelcomeStart(props) {
  const [isProgressBarDone, setIsProgressBarDone] = useState(false);
    setTimeout(()=> props.setCurrentPage(1), 2600)
    const theme = useTheme()
    return (
        <div>
          <img src={"MainLogo.svg"} className={styles.logo} />
          <div className={styles.progressBar}>
          </div>
        </div>
    )
}
