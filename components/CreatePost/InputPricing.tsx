import { useState } from "react";
import {
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  IconButton
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useAutocomplete, Autocomplete } from "@material-ui/lab";
import styled from "styled-components";
import { motion } from "framer-motion";
import { RentalPricing, BuyPricing, Pricing } from "./Post";
import DropdownSelection from "@components/DropdownSelection";

type InputRentalPeriod =
  | "1 Month"
  | "3 Months"
  | "6 Months"
  | "9 Months"
  | "1 Year";

const inputRentalPeriodOptions: InputRentalPeriod[] = [
  "1 Month",
  "3 Months",
  "6 Months",
  "9 Months",
  "1 Year"
];

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

const StyledInput = styled.input`
  max-width: 50;
  margin-left: 10;
  margin-right: 10;
`;
const StyledListBox = styled.ul`
  width: 100px;
  margin: 0px;
  margin-right: 10px;
  padding: 0px;
  z-index: 2;
  position: absolute;
  list-style: none;
  background-color: white;
  color: black;
  overflow: auto;
  max-height: 200px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  & li[data-focus="true"] {
    background-color: #4a8df6;
    color: white;
    cursor: pointer;
  }
  & li:active: {
    background-color: #2977f5;
    color: white;
  }
`;

const StyledFilloutPriceButton = styled.div`
  display: inline-block;
  align-items: center;
  appearance: none;
  background-color: rgb(103, 58, 183);
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
  cursor: pointer;
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
  height: 36px;
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

const StyledFilloutPriceButtonLabel = styled.span`
  align-items: center;
  color: rgb(255, 255, 255);
  cursor: pointer;
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
  height: 24px;
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

export function FilloutPriceButton() {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: inputRentalPeriodOptions,
    getOptionLabel: option => option
  });
  return (
    <StyledFilloutPriceButton>
      <StyledFilloutPriceButtonLabel>
        Rent for
        <input
          style={{ width: 100, marginLeft: 10, marginRight: 10 }}
          type="number"
        />
        Per
        <div {...getRootProps()}>
          <StyledInput
            style={{ maxWidth: 75, marginLeft: 10, marginRight: 10 }}
            {...getInputProps()}
          />
          {groupedOptions.length > 0 ? (
            <StyledListBox {...getListboxProps()}>
              {groupedOptions.map((option, index) => (
                <li key={index} {...getOptionProps({ option, index })}>
                  {option}
                </li>
              ))}
            </StyledListBox>
          ) : null}
        </div>
      </StyledFilloutPriceButtonLabel>
    </StyledFilloutPriceButton>
  );
}

export function FilloutPriceButton2() {
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

function ConfigPriceRow(props: { setBuyPriceConfig: (price: number) => void }) {
  const [price, setPrice] = useState<number | null>(null);
  const [priceTypeIndex, setPriceTypeIndex] = useState<0 | 1>(0);
  const [rentalPeriod, setRentalPeriod] = useState<InputRentalPeriod | null>(
    null
  );
  const [rentalPeriodInput, setRentalPeriodInput] = useState<
    string | undefined
  >("");
  const priceTypes = ["Rent", "Buy"];
  const priceType = priceTypes[priceTypeIndex];

  return (
    <TableRow component={motion.tr} layout>
      <TableCell align="left" component="th" scope="row">
        <DropdownSelection
          menuItems={priceTypes}
          defaultLabel="Buy or Rent"
          selectedItemIndex={priceTypeIndex}
          setSelectedItemIndex={setPriceTypeIndex}
        />
      </TableCell>
      <TableCell align="left" component="th" scope="row">
        {priceType === "Rent" && (
          <Autocomplete
            value={rentalPeriod}
            onChange={(event: any, newValue: InputRentalPeriod | null) => {
              setRentalPeriod(newValue);
            }}
            inputValue={rentalPeriodInput}
            onInputChange={(event, newInputValue: string | undefined) => {
              // We can be sure this is correct as its
              // the discrete set of such values
              setRentalPeriodInput(newInputValue);
            }}
            id="controllable-states-demo"
            options={inputRentalPeriodOptions}
            style={{ width: 200 }}
            renderInput={params => (
              <TextField
                {...params}
                label="Set Rental Period"
                variant="standard"
              />
            )}
          />
        )}
      </TableCell>
      <TableCell align="left" component="th" scope="row">
        <TextField
          fullWidth={false}
          style={{ maxWidth: 100 }}
          label="Set the Price"
          variant="standard"
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
          <ConfigPriceRow />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
