import React from "react";
import { Grid, Hidden, Typography } from "@material-ui/core";
import Navigation from "@components/Appbar/Navigation";
import Searchbar from "./Searchbar"; // "@components/Appbar/Searchbar";
import Menubar from "./Menubar";

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

export default function Appbar() {
  return (
    <div style={{ paddingTop: 10, marginBottom: 40, backgroundColor: "white" }}>
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
        <Grid item xs={12}>
          <Menubar pages={pages} />
        </Grid>
      </Grid>
    </div>
  );
}
