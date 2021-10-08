import { Typography, useTheme } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import CheckCircleGreen from "../../public/check-circle-green.svg";
import gsap from "gsap";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
export default function SuccessfulSignUp(props) {
  const router = useRouter()
  const theme = useTheme();
  const tl = useRef(null);
  const circleRef = useRef(null);
  const checkRef = useRef(null);

  /*
  useEffect(() => {
    const circleLength = circleRef.current.getTotalLength();
    const checkLength = checkRef.current.getTotalLength();
    tl.current = gsap
      .timeline()
      .fromTo(
        circleRef.current,
        { strokeDasharray: circleLength, strokeDashoffset: circleLength },
        { strokeDashoffset: 0, duration: 0.5 }
      )
      .fromTo(
        checkRef.current,
        { strokeDasharray: checkLength, strokeDashoffset: checkLength },
        { strokeDashoffset: 0, duration: 0.5 }
      );
  }, []);
  */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onAnimationComplete={()=> setTimeout(()=> router.push('/'), 100)}
      style={{ textAlign: "center" }}
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="100%"
          width={props.isMobile ? "200px" : "400px"}
          viewBox="0 0 24 24"
          fill={theme.valid.color}
        >
          <path ref={circleRef} d="M0 0h24v24H0V0z" fill="none" />
          <path
            ref={checkRef}
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"
          />
        </svg>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <Typography variant="h2">Thanks for signing up {props.name}</Typography>
      </div>
      <div>
        <Typography variant="h2">
          A verification email has been sent to {props.email} to confirm your
          account
        </Typography>
      </div>
    </motion.div>
  );
}
