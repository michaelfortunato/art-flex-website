import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Button,
  Grid,
  Tooltip
} from "@material-ui/core";
import { Add, BorderStyle, Check, Delete, Edit } from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/styles";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import * as BaseForm from "@components/Library/FormField/BaseFormField.styled";
import { DropdownSelection } from "@components/Dropdowns";
import BlackTooltip from "@components/BlackTooltip";
import { RootState } from "@redux-store/store";
import {
  InputBuyPricing,
  markBuyPriceNotConfirmed,
  removeBuyPrice,
  selectBuyPrice,
  setBuyPrice,
  setEmptyBuyPrice
} from "./buyPricingSlice";
import {
  inputRentalPeriodOptions,
  validRentalPricing,
  validBuyPricing,
  BuyPricing,
  getPriceError,
  MAX_NUM_RENTAL_PRICINGS,
  MAX_RENTAL_PRICES
} from "../Post";
import {
  addEmptyRentalPrice,
  InputRentalPricing,
  removeManyRentalPrices,
  removeOneRentalPrice,
  selectAllRentalPricingIds,
  selectAllRentalPricings,
  selectRentalPriceIdsWithDurationAndPeriod,
  selectRentalPricingById,
  upsertOneRentalPrice
} from "./rentalPricingsSlice";
import { PriceButtonText, PriceButtonWrapper } from "./PriceButtons";

type ConfigPriceRowProps = {
  priceType: "Rent" | "Buy";
  rentalPricing?: InputRentalPricing;
  buyPricing?: InputBuyPricing;
  initialPrice?: number;
  initialPeriod?: string;
  initialDuration?: number;
  rentalPriceId?: number | string;
  confirmed?: boolean;
};

function getInitialPrice(
  priceType: "Rent" | "Buy",
  rentalPricing?: InputRentalPricing,
  buyPricing?: InputBuyPricing
): number | undefined {
  if (priceType === "Rent") {
    return rentalPricing?.price;
  }
  return buyPricing?.price;
}
function getInitialPeriod(
  rentalPricing?: InputRentalPricing
): string | undefined {
  return rentalPricing?.period;
}
function getInitialDuration(
  rentalPricing?: InputRentalPricing
): number | undefined {
  return rentalPricing?.duration;
}
function isPricingConfirmed(
  priceType: "Rent" | "Buy",
  rentalPricing?: InputRentalPricing,
  buyPricing?: InputBuyPricing
): boolean {
  if (priceType === "Rent") {
    return rentalPricing?.confirmed === true;
  }
  return buyPricing?.confirmed === true;
}

function ConfigPriceRow(props: ConfigPriceRowProps) {
  // This is a complex component that needs describing/refactoring
  // 1. When a person creates an empty row,
  // a new entry is put into the redux store, therefore,
  // any changes to that row will be linked to the redux store.
  // However, we only want the redux store to reflect the change
  // after a consumer hits confirm. As a result, we store what is in
  // the row in temp variables. The state of these temp variables
  // can either be undefined or the value of teh redux store.

  const [price, setPrice] = useState<number | undefined>(
    getInitialPrice(props.priceType, props.rentalPricing, props.buyPricing)
  );
  const [period, setPeriod] = useState<string | undefined>(
    getInitialPeriod(props.rentalPricing)
  );
  const [duration, setDuration] = useState<number | undefined>(
    getInitialDuration(props.rentalPricing)
  );
  const confirmed = isPricingConfirmed(
    props.priceType,
    props.rentalPricing,
    props.buyPricing
  );

  const dispatch = useDispatch();

  const duplicateRentalPriceIds = useSelector(
    selectRentalPriceIdsWithDurationAndPeriod(duration, period)
  );

  function onDropdownSelection(itemNumber: number | null) {
    const newRentalPeriod =
      itemNumber !== null ? inputRentalPeriodOptions[itemNumber] : undefined;
    const newDuration = newRentalPeriod?.split(" ")[0];
    const newPeriod = newRentalPeriod?.split(" ")[1];

    if (typeof newDuration === "string") {
      setDuration(parseInt(newDuration, 10));
    }
    if (typeof newPeriod === "string") {
      setPeriod(newPeriod);
    }
  }

  function validatePrice(): boolean {
    if (props.priceType === "Rent") {
      return validRentalPricing({
        price,
        duration,
        period
      });
    }
    return validBuyPricing({ price });
  }

  function confirmPricing() {
    if (
      props.priceType === "Rent" &&
      props.rentalPricing?.rentalPriceId !== undefined
    ) {
      dispatch(
        upsertOneRentalPrice({
          rentalPriceId: props.rentalPricing.rentalPriceId,
          price,
          duration,
          period,
          confirmed: true
        } as InputRentalPricing)
      );
      dispatch(
        removeManyRentalPrices(
          duplicateRentalPriceIds.filter(
            rentalPriceId =>
              rentalPriceId !==
              (props.rentalPricing as InputRentalPricing).rentalPriceId
          )
        )
      );
    }
    if (props.priceType === "Buy") {
      dispatch(
        setBuyPrice({ price, isDraft: false, confirmed: true } as BuyPricing)
      );
    }
  }
  function unConfirmPricing() {
    if (
      props.priceType === "Rent" &&
      props.rentalPricing?.rentalPriceId !== undefined
    ) {
      dispatch(
        upsertOneRentalPrice({
          rentalPriceId: props.rentalPricing.rentalPriceId,
          confirmed: false
        })
      );
    }
    if (props.priceType === "Buy") {
      dispatch(markBuyPriceNotConfirmed());
    }
  }

  function onRowDelete() {
    if (
      props.priceType === "Rent" &&
      props.rentalPricing?.rentalPriceId !== undefined
    ) {
      dispatch(removeOneRentalPrice(props.rentalPricing.rentalPriceId));
    }
    if (props.priceType === "Buy") {
      dispatch(removeBuyPrice());
    }
  }

  const priceError = getPriceError(price);
  const showPriceError = price !== undefined && priceError !== null;

  return (
    <TableRow>
      <TableCell align="left" width="10%" style={{ height: 60, padding: 0 }}>
        {confirmed && <Check htmlColor="green" />}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        width="14%"
        style={{ height: 60, padding: 0 }}
      >
        <Typography variant="body1">{props.priceType}</Typography>
      </TableCell>
      <TableCell
        align="center"
        component="th"
        width="20%"
        style={{ height: 60, padding: 0 }}
      >
        {props.priceType === "Rent" && (
          <>
            {confirmed ? (
              <Typography>{`${duration} ${period}`}</Typography>
            ) : (
              <DropdownSelection
                defaultLabel={
                  duration !== undefined && period !== undefined
                    ? `${duration} ${period}`
                    : "Set Period"
                }
                menuItems={[...inputRentalPeriodOptions]}
                onClick={onDropdownSelection}
              />
            )}
          </>
        )}
      </TableCell>
      <TableCell
        align="right"
        component="th"
        width="30%"
        style={{ height: 60, padding: 0 }}
      >
        {confirmed ? (
          <Typography>${Number(price?.toFixed(2)).toLocaleString()}</Typography>
        ) : (
          <BlackTooltip
            title={showPriceError ? priceError.error : ""}
            placement="top"
          >
            <BaseForm.AFBaseFormField
              error={showPriceError}
              fullWidth={true}
              style={{ maxWidth: 150 }}
              placeholder="Set the Price"
              type="number"
              value={price || ""}
              onChange={e => {
                if (e.target.value === "") {
                  setPrice(undefined);
                } else {
                  setPrice(parseInt(e.target.value, 10));
                }
              }}
            />
          </BlackTooltip>
        )}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        width="%10"
        style={{ padding: 0 }}
      >
        {confirmed ? (
          <IconButton
            disabled={!validatePrice()}
            color="primary"
            onClick={unConfirmPricing}
          >
            <Edit />
          </IconButton>
        ) : (
          <IconButton
            disabled={!validatePrice()}
            color="primary"
            onClick={confirmPricing}
          >
            <Add />
          </IconButton>
        )}
      </TableCell>
      <TableCell align="center" component="th" width="10%">
        <IconButton color="primary" onClick={onRowDelete}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export function ConfigurePrices() {
  const buyPricing = useSelector(selectBuyPrice);
  const allRentalPricings = useSelector(selectAllRentalPricings);
  const hasBuyRow = buyPricing.price !== undefined || buyPricing.isDraft;

  const hideBuyPriceButton =
    buyPricing.price !== undefined || buyPricing.isDraft;
  const prevHideBuyPriceButton = useRef(hideBuyPriceButton);
  const hideRentalPriceButton = allRentalPricings.length >= MAX_RENTAL_PRICES;
  const prevHideRentalPriceButton = useRef(hideRentalPriceButton);

  useEffect(() => {
    prevHideBuyPriceButton.current = hideBuyPriceButton;
  }, [hideBuyPriceButton]);
  useEffect(() => {
    prevHideRentalPriceButton.current = hideRentalPriceButton;
  }, [hideRentalPriceButton]);

  const dispatch = useDispatch();

  function addBuyRow() {
    dispatch(setEmptyBuyPrice());
  }
  function onAddRentalRow() {
    dispatch(addEmptyRentalPrice());
  }

  return (
    <Grid container spacing={2} direction="column">
      <Grid item container justifyContent="space-evenly">
        <Grid item xs="auto">
          <BlackTooltip
            title={
              hasBuyRow ? "You can only configure at most one buy price." : ""
            }
            placement="top"
          >
            {
              // See MUI documentation for Tooltop to know why span is included.
              <span style={{ display: "inline-block" }}>
                <Button
                  disabled={hasBuyRow}
                  onClick={addBuyRow}
                  variant="contained"
                  color="primary"
                >
                  Add Buy Price
                </Button>
              </span>
            }
          </BlackTooltip>
        </Grid>
        <Grid item xs="auto">
          <Button
            onClick={onAddRentalRow}
            disabled={hideRentalPriceButton}
            variant="contained"
            color="primary"
          >
            Add Rental Price
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <TableContainer>
          <Table
            aria-label="simple table"
            padding="none"
            style={{ minWidth: 500 }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="left"></TableCell>
                <TableCell align="right" width={"20%"}>
                  Buy or Rent
                </TableCell>
                <TableCell align="center">Period</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hasBuyRow && (
                <ConfigPriceRow
                  key="buy"
                  priceType="Buy"
                  buyPricing={buyPricing}
                />
              )}
              {allRentalPricings.map(rentalPricing => (
                <ConfigPriceRow
                  key={rentalPricing.rentalPriceId}
                  priceType="Rent"
                  rentalPricing={rentalPricing}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
export function DraftPricing(props: {
  buyPrice?: BuyPricing;
  rentalPrices?: InputRentalPricing[];
}) {
  return (
    <Grid container direction="column" spacing={2}>
      {props.buyPrice && (
        <Grid item>
          <PriceButtonWrapper variant="primary">
            <PriceButtonText text={`Buy for $${props.buyPrice.price}`} />
          </PriceButtonWrapper>
        </Grid>
      )}
      {props.rentalPrices &&
        props.rentalPrices.map(({ rentalPriceId, price, duration, period }) => (
          <Grid key={rentalPriceId} item>
            <PriceButtonWrapper variant="secondary">
              <PriceButtonText
                text={`Rent for $${price} Per ${duration} ${period}`}
              />
            </PriceButtonWrapper>
          </Grid>
        ))}
    </Grid>
  );
}
