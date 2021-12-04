import { Grid, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import animationPage1 from "@public/Welcome-Page1.json";

export default function WelcomeStart(props) {
  console.log(animationPage1);
  setTimeout(
    () => props.setCurrentPage(1),
    props.duration ? props.duration : 1000
  );
  return (
    <motion.div exit={{ opacity: 0 }}>
      <Grid
        style={{ position: "relative", paddingTop: "10%" }}
        container
        alignItems="center"
      >
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography style={{ position: "relative" }} variant="h2">
            Welcome
          </Typography>
        </Grid>
      </Grid>
    </motion.div>
  );
}
