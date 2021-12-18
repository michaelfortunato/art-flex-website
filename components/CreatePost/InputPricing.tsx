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
  TooltipProps,
  FormControl
} from "@material-ui/core";
import { Add, BorderStyle } from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import styled from "styled-components";
import { motion } from "framer-motion";
import { DropdownSelection } from "@components/Dropdowns";
import * as BaseForm from "@components/Library/FormField/BaseFormField.styled";
import CustomAutocomplete from "@components/CustomAutocomplete";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux-store/store";
import { setBuyPrice, selectBuyPrice } from "./Pricing/buyPricingSlice";
import {
  RentalPricing,
  validBuyPricing,
  validPrice,
  validRentalPricing
} from "./Post";
import {
  selectRentalPricingById,
  upsertRentalPrice
} from "./Pricing/rentalPricingsSlice";

import * as PriceButtonStyles from "./Pricing/Pricing.styled";
import { InputRentalPriceButton } from "./Pricing/RentalPriceButtons";
import { InputBuyPriceButton } from "./Pricing/BuyPriceButtons";

const inputRentalPeriodOptions = [
  "1 Month",
  "3 Months",
  "6 Months",
  "9 Months",
  "1 Year"
] as const;

type InputRentalPeriod = typeof inputRentalPeriodOptions[number];

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
  const [priceEntered, setPriceEntered] = useState<boolean>(false);
  const priceRef = useRef<HTMLInputElement>(null);
  const prevPriceEntered = useRef<boolean>(false);

  const dispatch = useDispatch();
  const { price, error: priceError } = useSelector(selectBuyPrice);

  useEffect(() => {
    if (props.autoFocusOnMount) priceRef.current?.focus();
  }, [props.autoFocusOnMount]);
  useEffect(() => {
    if (prevPriceEntered.current) priceRef.current?.focus();
    prevPriceEntered.current = priceEntered;
  }, [priceEntered]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" || event.key === "Tab") {
      if (price && !priceError) setPriceEntered(true);
    }
  }

  return (
    <Grid container justifyContent="space-between">
      <Grid component={motion.div} item xs={12}>
        <ClickAwayListener
          onClickAway={() => {
            /// handleConditionalEnter("Price");
          }}
        >
          <PriceButtonStyles.Button variant="primary">
            <PriceButtonStyles.ButtonLabel variant="primary">
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
                      max: 15000,
                      onKeyDown: handleKeyDown,
                      type: "number",
                      placeholder: "Set Price"
                    }}
                    value={price}
                    // disabled={!!priceError}
                    onChange={event => {
                      const inputPrice = parseInt(
                        event.target.value as string,
                        10
                      );
                      console.log(inputPrice);
                      if (!inputPrice || inputPrice < 15000) {
                        console.log(price);
                        dispatch(
                          setBuyPrice({
                            price: !Number.isNaN(inputPrice)
                              ? inputPrice
                              : undefined
                          })
                        );
                      }
                    }}
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
            </PriceButtonStyles.ButtonLabel>
          </PriceButtonStyles.Button>
        </ClickAwayListener>
      </Grid>
    </Grid>
  );
}

interface FilloutRentalPricingButtonProps {
  id: string;
  autoFocusOnMount?: boolean;
}
function FilloutRentalPricingButton(props: FilloutRentalPricingButtonProps) {
  const [showPeriodTooltip, setShowPeriodToolTip] = useState(false);
  const [priceEntered, setPriceEntered] = useState<boolean>(false);
  const priceRef = useRef<HTMLInputElement>(null);
  const prevPriceEntered = useRef<boolean>(false);

  const dispatch = useDispatch();
  const { price, duration } =
    useSelector((state: RootState) =>
      selectRentalPricingById(state, props.id)
    ) || {};
  const theme = useTheme() as any;

  useEffect(() => {
    if (props.autoFocusOnMount) priceRef.current?.focus();
  }, [props.autoFocusOnMount]);

  useEffect(() => {
    if (prevPriceEntered.current) priceRef.current?.focus();
    prevPriceEntered.current = priceEntered;
  }, [priceEntered]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" || event.key === "Tab") {
      if (validPrice(price)) setPriceEntered(true);
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
            if (validPrice(price)) setPriceEntered(true);
          }}
        >
          <PriceButtonStyles.Button variant="secondary">
            <PriceButtonStyles.ButtonLabel variant="secondary">
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
                    // value: price === null ? undefined : price,
                    max: 15000,
                    onKeyDown: handleKeyDown,
                    type: "number",
                    placeholder: "Set Price"
                  }}
                  onChange={event => {
                    const inputPrice = parseInt(
                      event.target.value as string,
                      10
                    );
                    if (typeof props.id === "string") {
                      dispatch(
                        upsertRentalPrice({
                          rentalPriceId: props.id,
                          price: !Number.isNaN(inputPrice)
                            ? inputPrice
                            : undefined
                        })
                      );
                    }
                  }}
                />
              ) : (
                <BlackTooltip title="Click to change price" placement="top">
                  <Typography
                    onClick={() => {
                      dispatch(
                        upsertRentalPrice({
                          rentalPriceId: props.id,
                          price: undefined
                        })
                      );
                      setPriceEntered(false);
                    }}
                    variant="body1"
                    style={{ cursor: "pointer" }}
                  >
                    {/* Notice I cast rentalPricing as RentalPricing 
                        as priceEntered === true implies that rentalPricing 
                        is type RentalPricing and I want errors to show if 
                        that is not true. I'll probably remove 
                        this in production.
                    */}
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
                enterDelay={50}
              >
                <motion.div
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 1px 4px 0 rgb(34 34 34 / 10%) inset",
                    borderColor: "rgba(34, 34, 34, 0.15)",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderRadius: "6px"
                  }}
                  animate={
                    duration &&
                    ({
                      backgroundColor: (theme as any).palette.secondary.main,
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
                      if (typeof props.id === "string") {
                        dispatch(
                          upsertRentalPrice({
                            rentalPriceId: props.id,
                            period: newRentalPeriod?.split(" ")[1] as any,
                            duration: newRentalPeriod?.split(" ")[0] as any
                          })
                        );
                      }
                      // setRentalPeriod(newRentalPeriod);
                      // setPeriodEntered(true);
                    }}
                    buttonProps={{
                      style: duration
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
                            justifyContent: "center",
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
            </PriceButtonStyles.ButtonLabel>
          </PriceButtonStyles.Button>
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
        <FilloutRentalPricingButton
          key={"1"}
          id={"1"}
          autoFocusOnMount={true}
        />
      </Grid>
      <Grid item>
        <InputBuyPriceButton type="Buy" />
      </Grid>
      <Grid item>
        <InputRentalPriceButton key={"1"} id={"2"} autoFocusOnMount={true} />
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
