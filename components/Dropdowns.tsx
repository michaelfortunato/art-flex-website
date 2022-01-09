import { useState, useRef, useEffect, CSSProperties } from "react";
import {
  Paper,
  MenuList,
  MenuItem,
  Button,
  ClickAwayListener,
  Popper,
  Grow,
  ButtonProps
} from "@material-ui/core";

interface DropdownSelectionComponent {
  defaultLabel: string;
  menuItems: string[];
  onClick: (selectedItemIndex: number | null) => void;
  buttonProps?: ButtonProps;
  rootStyles?: CSSProperties;
}
interface DropdownTemplateParams extends DropdownSelectionComponent {
  isButton: boolean;
}

function DropdownTemplate(props: DropdownTemplateParams) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const prevOpen = useRef(open);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );

  const dropDownlabel =
    selectedItemIndex !== null && !props.isButton
      ? props.menuItems[selectedItemIndex]
      : props.defaultLabel;

  const handleToggle = () => {
    setOpen(oldOpen => !oldOpen);
  };

  const handleClose = (
    event: React.MouseEvent<EventTarget>,
    itemIndex: number | null
  ) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    props.onClick(itemIndex);
    setSelectedItemIndex(itemIndex);
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
    <div style={{ ...props.rootStyles }}>
      <Button
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        {...props.buttonProps}
      >
        {dropDownlabel}
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
              transformOrigin: "center bottom"
            }}
          >
            <Paper>
              <ClickAwayListener
                onClickAway={e => handleClose(e, selectedItemIndex)}
              >
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  {props.menuItems.map((menuItem, index) => (
                    <MenuItem key={index} onClick={e => handleClose(e, index)}>
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

type DropdownSelectionProps = DropdownSelectionComponent;
export function DropdownSelection(props: DropdownSelectionProps) {
  return (
    <DropdownTemplate
      defaultLabel={props.defaultLabel}
      isButton={false}
      onClick={props.onClick}
      menuItems={props.menuItems}
      buttonProps={props.buttonProps}
      rootStyles={props.rootStyles}
    />
  );
}

type DropdownButtonProps = DropdownSelectionComponent;
export default function DropdownButton(props: DropdownButtonProps) {
  return (
    <DropdownTemplate
      defaultLabel={props.defaultLabel}
      isButton={true}
      onClick={props.onClick}
      menuItems={props.menuItems}
      buttonProps={props.buttonProps}
      rootStyles={props.rootStyles}
    />
  );
}
