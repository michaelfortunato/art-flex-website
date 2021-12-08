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
  Divider
} from "@material-ui/core";
import { useState, useRef, forwardRef, MouseEventHandler } from "react";
import Link from "next/link";
import { signOut, useIsLoggedIn } from "@utils/account-fetcher";

function StyledLinkText(
  {
    href,
    text
  }: {
    href?: string;
    text: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
  },
  ref: any
) {
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
}

const ForwardRefStyledLinkText = forwardRef<
  any,
  { href?: any; text: string; onClick?: MouseEventHandler<HTMLAnchorElement> }
>(StyledLinkText);

export default function AccountMenu() {
  const { mutate } = useIsLoggedIn();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <IconButton ref={anchorRef} onClick={() => setOpen(true)} color="inherit">
        <AccountCircleTwoToneIcon fontSize="large" />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current}>
        <Paper>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <MenuList>
              <Grid container direction="column" spacing={2}>
                <Grid container item xs direction="column" spacing={0}>
                  <Grid item xs={12}>
                    <MenuItem>
                      <AccountCircleTwoToneIcon style={{ marginRight: "10" }} />
                      <Link href="/account" passHref>
                        <ForwardRefStyledLinkText text={"Your profile"} />
                      </Link>
                    </MenuItem>
                  </Grid>
                  <Grid item xs={12}>
                    <MenuItem>
                      <AccountBalanceWalletOutlinedIcon
                        style={{ marginRight: "10" }}
                      />
                      <Link href="/account/purchased" passHref>
                        <ForwardRefStyledLinkText text={"Purchased items"} />
                      </Link>
                    </MenuItem>
                  </Grid>
                  <Grid item xs={12}>
                    <MenuItem>
                      <StoreOutlinedIcon style={{ marginRight: "10" }} />
                      <Link href="/account/studio/sold" passHref>
                        <ForwardRefStyledLinkText text={"Sold items"} />
                      </Link>
                    </MenuItem>
                  </Grid>
                </Grid>
                <Grid item xs>
                  <Divider style={{ backgroundColor: "black" }} />
                </Grid>
                <Grid item xs>
                  <MenuItem onClick={() => signOut(mutate)}>
                    <SettingsIcon style={{ marginRight: "10" }} />
                    <Typography>Sign out</Typography>
                  </MenuItem>
                </Grid>
              </Grid>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
}
