import { useState, useEffect, useRef, KeyboardEvent } from "react";
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
import { RentalPricing, BuyPricing, Pricing } from "./Post";
import { PurchaseButton } from "pages/account/posts/create-post";

const inputRentalPeriodOptions = [
  "1 Month",
  "3 Months",
  "6 Months",
  "9 Months",
  "1 Year"
] as const;

type InputRentalPeriod = typeof inputRentalPeriodOptions[number];

function setRentalPricing(
  rentalPrice: RentalPricing,
  setPricing: (price: any) => void
) {
  setPricing((oldPricing: Pricing) => {
    if (oldPricing.rentalPricing?.length) {
      const popOldestElement = oldPricing.rentalPricing.length > 1;
      const startingIndex = popOldestElement ? 1 : 0;
      const newRentalPricing = [
        ...oldPricing.rentalPricing.slice(startingIndex),
        rentalPrice
      ];
      return { ...oldPricing, rentalPricing: newRentalPricing };
    }
    const newRentalPricing = [rentalPrice];
    return { ...oldPricing, rentalPricing: newRentalPricing };
  });
}

function setBuyPrice(buyPrice: BuyPricing, setPricing: (price: any) => void) {
  setPricing(
    (pricing: Pricing): Pricing => ({
      ...pricing,
      buyPrice
    })
  );
}

const StyledFilloutPriceButton = styled.div<{
  variant: "primary" | "secondary";
}>`
  display: inline-block;
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
  justify-content: center;
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

function isInputRentalPeriod(period: any): period is InputRentalPeriod {
  const notRentalPeriod = inputRentalPeriodOptions.every(
    option => period !== option
  );
  return !notRentalPeriod;
}
function validPrice(price: any): boolean {
  return typeof price === "number" && price > 0 && price < 15000;
}
interface FilloutPriceButtonProps {
  type: "Rent" | "Buy";
  addRentalPrice: (rentalPrice: RentalPricing) => void;
  setBuyPrice: (buyPrice: BuyPricing) => void;
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

  const [priceEntered, setPriceEntered] = useState<boolean>(false);
  const [periodEntered, setPeriodEntered] = useState<boolean>(false);
  const priceRef = useRef<HTMLInputElement>(null);
  const prevPriceEntered = useRef<boolean>(false);
  const prevPeriodEntered = useRef<boolean>(false);

  const theme = useTheme();
  console.log(theme);

  useEffect(() => {
    if (props.autoFocusOnMount) priceRef.current?.focus();
  }, [props.autoFocusOnMount]);
  useEffect(() => {
    if (prevPriceEntered.current) priceRef.current?.focus();
    prevPriceEntered.current = priceEntered;
  }, [priceEntered]);
  useEffect(() => {
    prevPeriodEntered.current = periodEntered;
  }, [periodEntered]);

  function onConfirm() {
    if (props.type === "Rent") {
      const [duration, period] = (rentalPeriod as InputRentalPeriod).split(
        " "
      ) as [number, "Month" | "Year"];
      const rentalPrice = {
        price,
        duration,
        period
      } as RentalPricing;
      props.addRentalPrice(rentalPrice);
    }
    if (props.type === "Buy") {
      const buyPrice = { price } as BuyPricing;
      props.setBuyPrice(buyPrice);
    }
  }
  function validPriceConfiguration() {
    const validRentalPeriod = isInputRentalPeriod(rentalPeriod);
    return validPrice(price) && (validRentalPeriod || props.type !== "Rent");
  }
  function handleConditionalEnter(fieldName: "Price" | "Period") {
    if (fieldName === "Price" && validPrice(price)) {
      setPriceEntered(true);
    }
    if (fieldName === "Period" && isInputRentalPeriod(rentalPeriod)) {
      setPeriodEntered(true);
    }
  }
  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: "Price" | "Period"
  ) {
    if (event.key === "Enter" || event.key === "Tab") {
      handleConditionalEnter(fieldName);
    }
  }
  return (
    <Grid container justifyContent="space-between">
      <Grid item xs="auto">
        <ClickAwayListener
          onClickAway={() => {
            handleConditionalEnter("Price");
            handleConditionalEnter("Period");
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
                    <input
                      ref={priceRef}
                      style={{
                        width: 100,
                        fontSize: 18,
                        borderStyle: "none",
                        outlineStyle: "none"
                      }}
                      min={0}
                      value={price === null ? undefined : price}
                      max={15000}
                      onKeyDown={event => handleKeyDown(event, "Price")}
                      onChange={event =>
                        setPrice(parseInt(event.target.value as string, 10))
                      }
                      type="number"
                      placeholder="Set Price"
                    />
                  ) : (
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
                  )}
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 400
                    }}
                  >
                    <b>&nbsp;Per&nbsp;</b>
                  </Typography>
                  {!periodEntered ? (
                    <CustomAutocomplete
                      // here we are copying the array to make it mutable I
                      // hope the performance is ok
                      autoFocusOnMount={prevPeriodEntered && !periodEntered}
                      options={[...inputRentalPeriodOptions]}
                      width={100}
                      onChange={newValue =>
                        setRentalPeriod(newValue as InputRentalPeriod)
                      }
                      InputProps={{
                        onKeyDown: event => handleKeyDown(event, "Period"),
                        placeholder: "Set Period",
                        style: {
                          width: 100,
                          fontSize: 18
                        }
                      }}
                    >
                      <input />
                    </CustomAutocomplete>
                  ) : (
                    <BlackTooltip title="Click to change rental period">
                      <Typography
                        onClick={() => {
                          setPeriodEntered(false);
                        }}
                        variant="body1"
                        style={{ cursor: "pointer" }}
                      >
                        <b>{rentalPeriod}</b>
                      </Typography>
                    </BlackTooltip>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="body1">
                    <b>Buy for $</b>
                  </Typography>
                  {!priceEntered ? (
                    <>
                      <input
                        ref={priceRef}
                        style={{
                          width: 100,
                          fontSize: 18,
                          marginRight: 10,
                          padding: 4,
                          borderStyle: "none"
                        }}
                        onChange={event =>
                          setPrice(parseInt(event.target.value as string, 10))
                        }
                        type="number"
                        placeholder="Set Price"
                        onKeyDown={event => handleKeyDown(event, "Price")}
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

export function InputPricing3() {
  return (
    <div>
      <div>
        <ConfigurablePriceTable />
      </div>
    </div>
  );
}
