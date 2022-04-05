import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux-store/store";
import { Grid, Typography, ClickAwayListener } from "@material-ui/core";
// import { Add, BorderStyle } from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { motion } from "framer-motion";
import { DropdownSelection } from "@components/Dropdowns";
import BlackTooltip from "@components/BlackTooltip";
import * as BaseForm from "@components/Library/FormField/BaseFormField.styled";
import * as PriceButtonStyles from "./Pricing.styled";
import { validPrice } from "../Post";
import { setBuyPrice, selectBuyPrice } from "./buyPricingSlice";
import {
  selectRentalPricingById,
  upsertOneRentalPrice
} from "./rentalPricingsSlice";

export function PriceButtonWrapper(props: {
  variant: "primary" | "secondary";
  children: React.ReactNode;
}) {
  return (
    <Grid container justifyContent="space-between">
      <Grid component={motion.div} item xs={12}>
        <PriceButtonStyles.Button variant={props.variant}>
          <PriceButtonStyles.ButtonLabel variant={props.variant}>
            {props.children}
          </PriceButtonStyles.ButtonLabel>
        </PriceButtonStyles.Button>
      </Grid>
    </Grid>
  );
}
// type InputRentalPeriod = typeof inputRentalPeriodOptions[number];

export function PriceButtonText(props: { text: string }) {
  return (
    <Typography variant="body1">
      <b>{props.text}</b>
    </Typography>
  );
}

function InputPriceField(props: {
  price: number | undefined;
  onPriceChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClickToChangePrice: () => void;
  autoFocusOnMount?: boolean;
}) {
  const [priceEntered, setPriceEntered] = useState(false);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const prevPriceEntered = useRef<boolean>(false);

  useEffect(() => {
    if (props.autoFocusOnMount) priceInputRef.current?.focus();
  }, [props.autoFocusOnMount]);

  useEffect(() => {
    if (prevPriceEntered.current) priceInputRef.current?.focus();
    prevPriceEntered.current = priceEntered;
  }, [priceEntered]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" || event.key === "Tab") {
      if (validPrice(props.price)) setPriceEntered(true);
    }
  }

  function onClickAway() {
    if (validPrice(props.price)) setPriceEntered(true);
  }

  return (
    <>
      {!priceEntered ? (
        <ClickAwayListener onClickAway={onClickAway}>
          <BaseForm.AFBaseFormField
            inputRef={priceInputRef}
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
            onChange={props.onPriceChange}
          />
        </ClickAwayListener>
      ) : (
        <BlackTooltip title="Click to change price" placement="top">
          <Typography
            onClick={() => {
              props.onClickToChangePrice();
              setPriceEntered(false);
            }}
            variant="body1"
            style={{ cursor: "pointer" }}
          >
            <b>{props.price}</b>
          </Typography>
        </BlackTooltip>
      )}
    </>
  );
}

const inputRentalPeriodOptions = [
  "1 Month",
  "3 Months",
  "6 Months",
  "9 Months",
  "1 Year"
] as const;
// type InputRentalPeriodOp = typeof inputRentalPeriodOptions[number];
function InputRentalPeriod(props: {
  id: string;
  duration: number | undefined;
}) {
  const [showPeriodTooltip, setShowPeriodToolTip] = useState(false);
  const theme = useTheme() as any;
  const dispatch = useDispatch();

  function onDropdownSelection(itemNumber: number | null) {
    const newRentalPeriod =
      itemNumber !== null ? inputRentalPeriodOptions[itemNumber] : null;
    if (typeof props.id === "string") {
      dispatch(
        upsertOneRentalPrice({
          rentalPriceId: props.id,
          period: newRentalPeriod?.split(" ")[1] as any,
          duration: newRentalPeriod?.split(" ")[0] as any
        })
      );
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
          props.duration &&
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
          onClick={onDropdownSelection}
          buttonProps={{
            style: props.duration
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
                  alignItems: "center",
                  width: 120,
                  fontSize: 18,
                  padding: 6,
                  paddingLeft: 8,
                  paddingRight: 8,
                  height: "inherit",
                  textTransform: "capitalize"
                }
          }}
        />
      </motion.div>
    </BlackTooltip>
  );
}

interface InputPriceButtonProps {
  autoFocusOnMount?: boolean;
}
interface InputRentalPriceButtonProps extends InputPriceButtonProps {
  id: string;
}
type InputBuyPriceButtonProps = InputPriceButtonProps;
export function InputRentalPriceButton(props: InputRentalPriceButtonProps) {
  const { price, duration } =
    useSelector((state: RootState) =>
      selectRentalPricingById(state, props.id)
    ) || {};
  const dispatch = useDispatch();

  function onPriceChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const inputPrice = parseInt(event.target.value as string, 10);
    if (typeof props.id === "string") {
      dispatch(
        upsertOneRentalPrice({
          rentalPriceId: props.id,
          price: !Number.isNaN(inputPrice) ? inputPrice : undefined
        })
      );
    }
  }

  // function onClickToChangePrice() {
  // dispatch(
  // upsertRentalPrice({
  // rentalPriceId: props.id,
  // price: undefined
  // })
  // );
  // }
  return (
    <PriceButtonWrapper variant="secondary">
      <PriceButtonText text="Rent for $" />
      <InputPriceField
        price={price}
        onPriceChange={onPriceChange}
        onClickToChangePrice={() => {}}
        autoFocusOnMount={props.autoFocusOnMount}
      />
      <PriceButtonText text="&nbsp;Per&nbsp;" />
      <InputRentalPeriod id={props.id} duration={duration} />
    </PriceButtonWrapper>
  );
}

export function InputBuyPriceButton(props: InputBuyPriceButtonProps) {
  const dispatch = useDispatch();
  const { price } = useSelector(selectBuyPrice);

  function onPriceChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const inputPrice = parseInt(event.target.value as string, 10);
    dispatch(
      setBuyPrice({
        price: !Number.isNaN(inputPrice) ? inputPrice : undefined
      })
    );
  }
  // function onClickToChangePrice() {
  // dispatch(setBuyPrice);
  // }
  return (
    <PriceButtonWrapper variant="primary">
      <PriceButtonText text="Buy for $" />
      <InputPriceField
        price={price}
        onPriceChange={onPriceChange}
        onClickToChangePrice={() => {}}
        autoFocusOnMount={props.autoFocusOnMount}
      ></InputPriceField>
    </PriceButtonWrapper>
  );
}
