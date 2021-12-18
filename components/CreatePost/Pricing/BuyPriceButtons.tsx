import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Grid, Typography, ClickAwayListener } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import BlackTooltip from "@components/BlackTooltip";
import * as BaseForm from "@components/Library/FormField/BaseFormField.styled";
import * as PriceButtonStyles from "./Pricing.styled";
import { setBuyPrice, selectBuyPrice } from "./buyPricingSlice";

interface InputBuyPriceButtonProps {
  autoFocusOnMount?: boolean;
}
export function InputBuyPriceButton(props: InputBuyPriceButtonProps) {
  const [priceEntered, setPriceEntered] = useState<boolean>(false);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const prevPriceEntered = useRef<boolean>(false);

  const dispatch = useDispatch();
  const { price, error: priceError } = useSelector(selectBuyPrice);

  useEffect(() => {
    if (props.autoFocusOnMount) priceInputRef.current?.focus();
  }, [props.autoFocusOnMount]);
  useEffect(() => {
    if (prevPriceEntered.current) priceInputRef.current?.focus();
    prevPriceEntered.current = priceEntered;
  }, [priceEntered]);

  function onChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const inputPrice = parseInt(event.target.value as string, 10);
    dispatch(
      setBuyPrice({
        price: !Number.isNaN(inputPrice) ? inputPrice : undefined
      })
    );
  }
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
                    onChange={onChange}
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
