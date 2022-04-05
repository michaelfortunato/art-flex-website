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
  defaultLabel: string;
  menuItems: string[];
  selectedItemIndex: number | undefined;
  setSelectedItemIndex: Dispatch<SetStateAction<any>>;
}
export default function SimpleListMenu(props: SimpleListMenuProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const prevOpen = useRef(open);
  const handleToggle = () => {
    setOpen(oldOpen => !oldOpen);
  };

  const handleClose = (
    event: React.MouseEvent<EventTarget>,
    index: number | undefined
  ) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    if (index !== undefined && index !== props.selectedItemIndex)
      props.setSelectedItemIndex(index);
    setOpen(false);
  };

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
      >
        {props.selectedItemIndex !== undefined
          ? props.menuItems[props.selectedItemIndex]
          : props.defaultLabel}
      </Button>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
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
              <ClickAwayListener
                onClickAway={(e: React.MouseEvent<EventTarget>) =>
                  handleClose(e, props.selectedItemIndex)
                }
              >
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  {props.menuItems.map((menuItem, index) => (
                    <MenuItem
                      key={menuItem}
                      onClick={(e: React.MouseEvent<EventTarget>) =>
                        handleClose(e, index)
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
