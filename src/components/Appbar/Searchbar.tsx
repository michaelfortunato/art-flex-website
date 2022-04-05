import React from "react";
import { Paper, InputBase, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import styles from "@styles/Searchbar.module.css";

export default function Searchbar() {
  return (
    <div>
      <Paper elevation={0} className={styles.SearchBox}>
        <InputBase
          className={styles.InputBase}
          startAdornment={
            <IconButton className={styles.IconButton} type="submit">
              <SearchIcon />
            </IconButton>
          }
          placeholder="Search for art and artists"
        />
      </Paper>
    </div>
  );
}
