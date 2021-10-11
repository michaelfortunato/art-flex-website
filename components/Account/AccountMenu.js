import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import AccountCircleTwoToneIcon from "@material-ui/icons/AccountCircleTwoTone";
import SettingsIcon from "@material-ui/icons/Settings";
import StoreOutlinedIcon from "@material-ui/icons/StoreOutlined";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import {
  ClickAwayListener,
  IconButton,
  Popper,
  MenuItem,
  MenuList,
  Paper,
  Typography,
  Grid,
  Divider,
  Grow,
} from "@material-ui/core";
import { useState, useRef, forwardRef } from "react";
import Link from "next/link";

const StyledLinkText = forwardRef(({ href, text }, ref) => {
  return (
    <Typography>
      <a
        href={href}
        ref={ref}
        style={{ color: "inherit", textDecoration: "none" }}
      >
        {text}
      </a>
    </Typography>
  );
});

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef();

  return (
    <>
      <IconButton ref={anchorRef} onClick={() => setOpen(true)} color="inherit">
        <AccountCircleTwoToneIcon fontSize="large" />
      </IconButton>
      <Popper style={{zIndex: 20}}open={open} anchorEl={anchorRef.current} transition disablePortal>
		{({ TransitionProps, placement }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: "center top" }}>
          <Paper>
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <MenuList>
                <Grid container direction="column" spacing={2}>
                  <Grid container item xs direction="column" spacing={0}>
                    <Grid item xs={12}>
                      <MenuItem>
                        <AccountCircleTwoToneIcon
                          style={{ marginRight: "10" }}
                        />
                        <Link href="/profile" passHref>
                          <StyledLinkText text={"Your profile"} />
                        </Link>
                      </MenuItem>
                    </Grid>
                    <Grid item xs={12}>
                      <MenuItem>
                        <AccountBalanceWalletOutlinedIcon
                          style={{ marginRight: "10" }}
                        />
                        <Link href="/profile/purchased" passHref>
                          <StyledLinkText text={"Purchased items"} />
                        </Link>
                      </MenuItem>
                    </Grid>
                    <Grid item xs={12}>
                      <MenuItem>
                        <StoreOutlinedIcon style={{ marginRight: "10" }} />
                        <Link href="/profile/studio/sold" passHref>
                          <StyledLinkText text={"Sold items"} />
                        </Link>
                      </MenuItem>
                    </Grid>
                  </Grid>
                  <Grid item xs>
                    <Divider style={{ backgroundColor: "black" }} />
                  </Grid>
                  <Grid item xs>
                    <MenuItem>
                      <SettingsIcon style={{ marginRight: "10" }} />
                      <Typography>Sign out</Typography>
                    </MenuItem>
                  </Grid>
                </Grid>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
		)}
      </Popper>
    </>
  );
}
