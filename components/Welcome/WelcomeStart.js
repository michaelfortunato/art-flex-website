import React from 'react'
import styles from "@styles/WelcomeStart.module.css";
import ProgressBar from "@components/ProgressBar";
import { useState, useEffect } from "react";



export default function WelcomeStart(props) {
  const [isProgressBarDone, setIsProgressBarDone] = useState(false);
    setTimeout(()=> props.setCurrentPage(1), 1000)
    return (
        <div>
          <img src={"MainLogo.svg"} className={styles.logo} />
          <div className={styles.progressBar}>
          </div>
        </div>
    )
}
