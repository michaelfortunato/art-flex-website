import React from "react";
import {
  Button,
  Grid,
  IconButton,
  StylesProvider,
  Typography,
} from "@material-ui/core";
import SignIn from "@components/SignIn/SignIn";
/* Icons */
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import AccountCircleTwoToneIcon from "@material-ui/icons/AccountCircleTwoTone";

import AccountMenu from "@components/Account/AccountMenu";

import { useSelector } from "react-redux";
import { selectAccount } from "redux-store/features/account/accountSlice";
import { AppbarButton } from "@components/Library";
import { StandardButton } from "./Buttons/SignInButton";
export default function Navigation() {
  const { name, email } = useSelector(selectAccount);
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
      <Grid item xs="auto"></Grid>
      <Grid item xs="auto">
        {email !== null ? (
         <AccountMenu /> 
        ) : (
          <SignIn />
        )}
      </Grid>
    </Grid>
  );
}
/*
          <StandardButton
                        animateTo={{
                            boxShadow: '0 4px 20px rgb(34 34 34 / 15%)',
                            scale: 1.02
                        }}
                        animate={true}
                        styleOverrides={
                            {
                                padding: 8,
                                paddingLeft: 18,
                                paddingRight: 18,
                            }}
                        onClick={() => props.setPage('SignUp')}
                    >
                        <Typography variant='body1'>Sell</Typography>
                    </StandardButton>*/
