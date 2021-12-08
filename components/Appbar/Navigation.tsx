import React from "react";
import { Grid, IconButton } from "@material-ui/core";
/* Icons */
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
// import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
// import AccountCircleTwoToneIcon from "@material-ui/icons/AccountCircleTwoTone";

// import { useSelector } from "react-redux";
// import { selectAccount } from "redux-store/features/account/accountSlice";
import { useIsLoggedIn } from "@utils/account-fetcher";
import AccountMenu from "./AccountMenu";
import AppbarButton from "./AppbarButton";
import SignInAppbar from "./SignInAppbar";

export default function Navigation() {
  const { user } = useIsLoggedIn();
  return (
    <Grid container justifyContent="space-evenly">
      <Grid item xs="auto">
        <AppbarButton style={{ marginLeft: 0 }} text="Sell" />
      </Grid>
      <Grid item xs="auto">
        <IconButton color="inherit">
          <ShoppingCartOutlinedIcon fontSize="large" />
        </IconButton>
      </Grid>
      <Grid item xs="auto">
        {user ? <AccountMenu /> : <SignInAppbar />}
      </Grid>
    </Grid>
  );
}
