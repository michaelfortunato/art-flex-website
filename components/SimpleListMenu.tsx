import { useState, useRef, useEffect, SetStateAction, Dispatch } from "react";
import {
  Paper,
  MenuList,
  MenuItem,
  Button,
  ClickAwayListener,
  Popper,
  Grow
} from "@material-ui/core";

interface SimpleListMenuProps {
  buttonLabel: string;
  menuItems: Record<string, boolean>;
  handleMenuItemClick: Dispatch<SetStateAction<any>>;
}
export default function SimpleListMenu(props: SimpleListMenuProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const prevOpen = useRef(open);
  const handleToggle = () => {
    setOpen(oldOpen => !oldOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  function handleClick(event: React.MouseEvent<EventTarget>, menuItem: string) {
    handleClose(event);
    props.handleMenuItemClick(menuItem);
  }
  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      <Button
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        variant="contained"
        color={"primary"}
      >
        {props.buttonLabel}
      </Button>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal={false}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom"
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  {Object.keys(props.menuItems).map(menuItem => (
                    <MenuItem
                      key={menuItem}
                      disabled={props.menuItems[menuItem]}
                      onClick={(e: React.MouseEvent<EventTarget>) =>
                        handleClick(e, menuItem)
                      }
                    >
                      {menuItem}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
