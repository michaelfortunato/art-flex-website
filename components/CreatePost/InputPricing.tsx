import {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
  ChangeEvent
} from "react";
import {
  Grid,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  ClickAwayListener,
  Tooltip,
  TooltipProps
} from "@material-ui/core";
import { Add, BorderStyle } from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import styled from "styled-components";
import { motion } from "framer-motion";
import { DropdownSelection } from "@components/Dropdowns";
import * as BaseForm from "@components/Library/FormField/BaseFormField.styled";
import CustomAutocomplete from "@components/CustomAutocomplete";
import { useSelector, useDispatch } from "react-redux";
import {
  setBuyPrice,
  upsertRentalPrice,
  removeRentalPrice
} from "./Pricing/pricingSlice";
import { validBuyPricing, validPrice, validRentalPricing } from "./Post";

const inputRentalPeriodOptions = [
  "1 Month",
  "3 Months",
  "6 Months",
  "9 Months",
  "1 Year"
] as const;

type InputRentalPeriod = typeof inputRentalPeriodOptions[number];

const StyledFilloutPriceButton = styled.div<{
  variant: "primary" | "secondary";
}>`
  display: inline-flex;
  align-items: center;
  appearance: none;
  background-color: ${props =>
    props.variant === "primary"
      ? props.theme.palette.primary.main
      : props.theme.palette.secondary.main};
  border-bottom-color: rgb(255, 255, 255);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-style: none;
  border-bottom-width: 0px;
  border-image-outset: 0;
  border-image-repeat: stretch;
  border-image-slice: 100%;
  border-image-source: none;
  border-image-width: 1;
  border-left-color: rgb(255, 255, 255);
  border-left-style: none;
  border-left-width: 0px;
  border-right-color: rgb(255, 255, 255);
  border-right-style: none;
  border-right-width: 0px;
  border-top-color: rgb(255, 255, 255);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  box-sizing: border-box;
  color: rgb(255, 255, 255);
  display: inline-flex;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-stretch: 100%;
  font-style: normal;
  font-variant-caps: normal;
  font-variant-east-asian: normal;
  font-variant-ligatures: normal;
  font-variant-numeric: normal;
  font-weight: 500;
  min-height: 36px;
  justify-content: flex-start;
  letter-spacing: 0.39998px;
  line-height: 24.5px;
  margin-bottom: 0px;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  min-width: 64px;
  outline-color: rgb(255, 255, 255);
  outline-style: none;
  outline-width: 0px;
  padding-bottom: 6px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 6px;
  position: relative;
  text-align: center;
  text-decoration-color: rgb(255, 255, 255);
  text-decoration-line: none;
  text-decoration-style: solid;
  text-decoration-thickness: auto;
  text-indent: 0px;
  text-rendering: auto;
  text-shadow: none;
  text-transfor: muppercase;
  user-select: none;
  vertical-align: middle;
  word-spacing: 0px;
  writing-mode: horizontal-tb;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-border-image: none;
`;

const StyledFilloutPriceButtonLabel = styled.span<{
  variant: "primary" | "secondary";
}>`
  padding: 4px;
  align-items: center;
  color: ${props => (props.variant === "primary" ? "#FFFFFF" : "#000000")};
  display: flex;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-stretch: 100%;
  font-style: normal;
  font-variant-caps: normal;
  font-variant-east-asian: normal;
  font-variant-ligatures: normal;
  font-variant-numeric: normal;
  font-weight: 500;
  min-height: 24px;
  justify-content: center;
  letter-spacing: 0.39998px;
  line-height: 24.5px;
  text-align: center;
  text-decoration-thickness: auto;
  text-indent: 0px;
  text-rendering: auto;
  text-shadow: none;
  text-transform: uppercase;
  user-select: none;
  word-spacing: 0px;
  writing-mode: horizontal-tb;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;

interface FilloutPriceButtonProps {
  type: "Rent" | "Buy";
  autoFocusOnMount?: boolean;
}

const BlackTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .MuiTooltip-tooltip {
    background-color: #000000;
    font-size: ${props => props.theme.typography.body1.fontSize};
  }
  & .MuiTooltip-arrow {
    background-color: #000000;
  }
`;

export function FilloutPriceButton(props: FilloutPriceButtonProps) {
  const [rentalPeriod, setRentalPeriod] = useState<InputRentalPeriod | null>(
    null
  );
  const [price, setPrice] = useState<number | null>(null);
  const [showPeriodTooltip, setShowPeriodToolTip] = useState(false);
  const [priceEntered, setPriceEntered] = useState<boolean>(false);
  const priceRef = useRef<HTMLInputElement>(null);
  const prevPriceEntered = useRef<boolean>(false);

  const dispatch = useDispatch();
  const theme = useTheme() as any;

  useEffect(() => {
    if (props.autoFocusOnMount) priceRef.current?.focus();
  }, [props.autoFocusOnMount]);
  useEffect(() => {
    if (prevPriceEntered.current) priceRef.current?.focus();
    prevPriceEntered.current = priceEntered;
  }, [priceEntered]);

  function handleConditionalEnter(fieldName: "Price" | "Period") {
    if (fieldName === "Price" && validPrice(price)) {
      setPriceEntered(true);
    }
  }

  useEffect(() => {
    if (
      props.type === "Rent" &&
      priceEntered &&
      typeof rentalPeriod === "string"
    ) {
      const [duration, period] = rentalPeriod.split(" ");
      const newRentalPrice = {
        price,
        duration: duration && parseInt(duration, 10),
        period
      };
      if (validRentalPricing(newRentalPrice)) {
        console.log(newRentalPrice);
        dispatch(upsertRentalPrice(newRentalPrice));
      }
    }
    if (props.type === "Buy" && priceEntered) {
      const newBuyPrice = { price };
      if (validBuyPricing(newBuyPrice)) dispatch(setBuyPrice(newBuyPrice));
    }
  }, [props.type, priceEntered, price, rentalPeriod, dispatch]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: "Price" | "Period"
  ) {
    if (event.key === "Enter" || event.key === "Tab") {
      handleConditionalEnter(fieldName);
    }
  }

  function handlePeriodTooltipOpen(e: ChangeEvent<any>) {
    // Detect where we hovered over button lable,
    // if not, cancel the event.
    if (!e.target.classList.contains("MuiButton-label")) {
      setShowPeriodToolTip(false);
    } else {
      setShowPeriodToolTip(true);
    }
  }

  function handlePeriodTooltipClose() {
    setShowPeriodToolTip(false);
  }
  return (
    <Grid container justifyContent="space-between">
      <Grid component={motion.div} item xs={12}>
        <ClickAwayListener
          onClickAway={() => {
            handleConditionalEnter("Price");
          }}
        >
          <StyledFilloutPriceButton
            variant={props.type === "Rent" ? "secondary" : "primary"}
          >
            <StyledFilloutPriceButtonLabel
              variant={props.type === "Rent" ? "secondary" : "primary"}
            >
              {props.type === "Rent" ? (
                <>
                  <Typography variant="body1">
                    <b>Rent for $</b>
                  </Typography>
                  {!priceEntered ? (
                    <BaseForm.AFBaseFormField
                      inputRef={priceRef}
                      style={{
                        width: 114,
                        fontSize: 18,
                        padding: 4,
                        paddingLeft: 8,
                        paddingRight: 8,
                        height: "inherit"
                      }}
                      inputProps={{
                        min: 0,
                        value: price === null ? undefined : price,
                        max: 15000,
                        onKeyDown: event => handleKeyDown(event, "Price"),
                        type: "number",
                        placeholder: "Set Price"
                      }}
                      onChange={event =>
                        setPrice(parseInt(event.target.value as string, 10))
                      }
                    />
                  ) : (
                    <BlackTooltip title="Click to change price" placement="top">
                      <Typography
                        onClick={() => {
                          setPriceEntered(false);
                        }}
                        variant="body1"
                        style={{ cursor: "pointer" }}
                      >
                        <b>{price}</b>
                      </Typography>
                    </BlackTooltip>
                  )}
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 400
                    }}
                  >
                    <b>&nbsp;Per&nbsp;</b>
                  </Typography>
                  <BlackTooltip
                    title="Click to change rental period"
                    placement="top"
                    open={showPeriodTooltip}
                    onClose={handlePeriodTooltipClose}
                    onOpen={handlePeriodTooltipOpen}
                  >
                    <motion.div
                      style={{
                        backgroundColor: "white",
                        boxShadow: "0 1px 4px 0 rgb(34 34 34 / 10%) inset",
                        borderColor: "rgba(34, 34, 34, 0.15)",
                        borderStyle: "solid",
                        borderWidth: "1px",
                        borderRadius: "6px",
                        color: "darkGrey"
                      }}
                      animate={
                        rentalPeriod &&
                        ({
                          backgroundColor: (theme as any).palette.secondary
                            .main,
                          padding: 0,
                          borderStyle: "none",
                          borderRadius: "0px",
                          borderWidth: "0px",
                          boxShadow: "none"
                        } as any)
                      }
                    >
                      <DropdownSelection
                        defaultLabel="Set Period"
                        menuItems={[...inputRentalPeriodOptions]}
                        onClick={itemNumber => {
                          const newRentalPeriod =
                            itemNumber !== null
                              ? inputRentalPeriodOptions[itemNumber]
                              : null;
                          setRentalPeriod(newRentalPeriod);
                          // setPeriodEntered(true);
                        }}
                        buttonProps={{
                          style: rentalPeriod
                            ? {
                                fontSize: theme.typography.body1.fontSize,
                                fontWeight: 1000,
                                padding: 0,
                                color: "#000000",
                                alignItems: "none",
                                justifyContent: "start"
                              }
                            : {
                                fontWeight: 400,
                                color: "darkGrey",
                                justifyContent: "start",
                                width: 120,
                                fontSize: 18,
                                padding: 4,
                                paddingLeft: 8,
                                paddingRight: 8,
                                height: "inherit",
                                textTransform: "capitalize"
                              }
                        }}
                      />
                    </motion.div>
                  </BlackTooltip>
                </>
              ) : (
                <>
                  <Typography variant="body1">
                    <b>Buy for $</b>
                  </Typography>
                  {!priceEntered ? (
                    <>
                      <BaseForm.AFBaseFormField
                        inputRef={priceRef}
                        style={{
                          width: 114,
                          fontSize: 18,
                          padding: 4,
                          paddingLeft: 8,
                          paddingRight: 8,
                          height: "inherit"
                        }}
                        inputProps={{
                          min: 0,
                          value: price === null ? undefined : price,
                          max: 15000,
                          onKeyDown: event => handleKeyDown(event, "Price"),
                          type: "number",
                          placeholder: "Set Price"
                        }}
                        onChange={event =>
                          setPrice(parseInt(event.target.value as string, 10))
                        }
                      />
                    </>
                  ) : (
                    <>
                      <BlackTooltip title="Click to change price">
                        <Typography
                          onClick={() => {
                            setPriceEntered(false);
                          }}
                          variant="body1"
                          style={{ cursor: "pointer" }}
                        >
                          <b>{price}</b>
                        </Typography>
                      </BlackTooltip>
                    </>
                  )}
                </>
              )}
            </StyledFilloutPriceButtonLabel>
          </StyledFilloutPriceButton>
        </ClickAwayListener>
      </Grid>
    </Grid>
  );
}

export function FilloutPriceButtonBuy() {
  const [rentalPeriod, setRentalPeriod] = useState<InputRentalPeriod | null>(
    null
  );
  return (
    <Grid container justifyContent="space-between">
      <Grid item xs="auto">
        <StyledFilloutPriceButton variant="primary">
          <StyledFilloutPriceButtonLabel variant="primary"></StyledFilloutPriceButtonLabel>
        </StyledFilloutPriceButton>
      </Grid>
      <Grid item>
        <IconButton color="primary">
          <Add />
        </IconButton>
      </Grid>
    </Grid>
  );
}
export function FilloutPriceButtonDeprecated() {
  <Button
    disableRipple
    disableFocusRipple
    disableElevation
    disableTouchRipple
    onClick={() => 1}
    variant="contained"
    color="primary"
  >
    Rent for <input style={{ maxWidth: 100 }} />
    Per
    <input style={{ maxWidth: 100, marginLeft: 4, marginRight: 4 }} />
  </Button>;
}

function ConfigPriceRow(props: {
  priceType: "Rent" | "Buy";
  setBuyPriceConfig: (price: number) => void;
}) {
  const [price, setPrice] = useState<number | null>(null);
  const [rentalPeriod, setRentalPeriod] = useState<InputRentalPeriod | null>(
    null
  );
  console.log(rentalPeriod);
  return (
    <TableRow component={motion.tr} layout>
      <TableCell align="left" component="th" scope="row">
        <Typography variant="body1">{props.priceType}</Typography>
      </TableCell>
      <TableCell align="left" component="th" scope="row">
        {props.priceType === "Rent" && (
          <CustomAutocomplete
            InputProps={{
              placeholder: "Select Period"
            }}
            options={["1 Month"]}
            width={200}
            onChange={newValue =>
              setRentalPeriod(newValue as InputRentalPeriod)
            }
          >
            <BaseForm.AFBaseFormField />
          </CustomAutocomplete>
        )}
      </TableCell>
      <TableCell align="left" component="th" scope="row">
        <BaseForm.AFBaseFormField
          fullWidth={true}
          style={{ maxWidth: 150 }}
          placeholder="Set the Price"
          type="number"
          onChange={e => setPrice(parseInt(e.target.value, 10))}
        />
      </TableCell>
      <TableCell align="center" component="th" scope="row">
        <IconButton
          color="primary"
          disabled={typeof price !== "number" || price <= 0}
          onClick={() =>
            typeof price === "number" && props.setBuyPriceConfig(price)
          }
        >
          <Add />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export function ConfigurablePriceTable() {
  return (
    <TableContainer component={motion.div} layout>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Buy or Rent</TableCell>
            <TableCell align="left">Period</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Confirm</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ConfigPriceRow priceType="Rent" />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function InputPricing2() {
  return (
    <div>
      <span style={{ marginRight: 10 }}>
        <DropdownSelection
          defaultLabel="Add Buy Pricing"
          buttonProps={{
            color: "primary",
            variant: "contained"
          }}
          menuItems={["Eyee", "Whoadie"]}
          rootStyles={{
            display: "inline"
          }}
        />
      </span>
      <span style={{ marginLeft: 10 }}>
        <Button variant="contained" color="secondary">
          Add Rental Pricing
        </Button>
      </span>
      <div></div>
    </div>
  );
}

export function InputPricing() {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <FilloutPriceButton autoFocusOnMount={true} type="Rent" />
      </Grid>
      <Grid item>
        <FilloutPriceButton type="Buy" />
      </Grid>
    </Grid>
  );
}

export function InputPricing1() {
  return (
    <div>
      <div>
        <ConfigurablePriceTable />
      </div>
    </div>
  );
}
