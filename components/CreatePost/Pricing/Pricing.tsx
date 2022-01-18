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
import {
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
  getPriceError
} from "../Post";
import {
  addEmptyRentalPrice,
  InputRentalPricing,
  removeManyRentalPrices,
  removeOneRentalPrice,
  selectAllRentalPricingIds,
  selectRentalPriceIdsWithDurationAndPeriod,
  upsertOneRentalPrice
} from "./rentalPricingsSlice";
import { PriceButtonText, PriceButtonWrapper } from "./PriceButtons";

type ConfigPriceRowProps = {
  priceType: "Rent" | "Buy";
  rentalPriceId?: number | string;
};

function ConfigPriceRow(props: ConfigPriceRowProps) {
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [period, setPeriod] = useState<string | undefined>(undefined);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [confirmed, setConfirmed] = useState<boolean>(false);

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
    if (props.priceType === "Rent" && props.rentalPriceId !== undefined) {
      dispatch(
        upsertOneRentalPrice({
          rentalPriceId: props.rentalPriceId,
          price,
          duration,
          period
        } as InputRentalPricing)
      );
      dispatch(
        removeManyRentalPrices(
          duplicateRentalPriceIds.filter(
            rentalPriceId => rentalPriceId !== props.rentalPriceId
          )
        )
      );
      setConfirmed(true);
    }
    if (props.priceType === "Buy") {
      dispatch(setBuyPrice({ price } as BuyPricing));
      setConfirmed(true);
    }
  }

  function onRowDelete() {
    if (props.priceType === "Rent" && props.rentalPriceId !== undefined) {
      dispatch(removeOneRentalPrice(props.rentalPriceId));
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
            onClick={() => setConfirmed(false)}
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
  const { price: buyPrice, isDraft: isBuyPriceDraft } =
    useSelector(selectBuyPrice);
  const hasBuyRow = buyPrice !== undefined || isBuyPriceDraft;
  const rentalPriceIds = useSelector(selectAllRentalPricingIds);
  const dispatch = useDispatch();

  // function onConfirmBuyPrice(buyPrice: BuyPricing) {
  // dispatch(setBuyPrice(buyPrice));
  // }

  // function onBuyRowDelete() {
  // dispatch(removeBuyPrice);
  // setHasBuyPrice(false);
  // }

  // function onConfirmRentalPrice(rentalPrice: InputRentalPricing) {
  // const removeRentalPriceIds = findRentalPricesWithDurationAndPeriod(
  // rentalPrice.duration,
  // rentalPrice.period,
  // rentalPricings
  // ).map(({ rentalPriceId }) => rentalPriceId);
  // dispatch(removeManyRentalPrices(removeRentalPriceIds));
  // dispatch(upsertOneRentalPrice(rentalPrice));
  // }

  // function onRentalRowDelete(deleteId: number) {
  // setRentalPriceIds((oldRentalPriceIds: number[]) => {
  // const newRentalPriceIds = oldRentalPriceIds.filter(
  // oldRentalPriceId => oldRentalPriceId !== deleteId
  // );
  // return [...newRentalPriceIds];
  // });
  // dispatch(removeRentalPrice(deleteId));
  // }

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
          <Button
            disabled={hasBuyRow}
            onClick={addBuyRow}
            variant="contained"
            color="primary"
          >
            Add Buy Price
          </Button>
        </Grid>
        <Grid item xs="auto">
          <Button onClick={onAddRentalRow} variant="contained" color="primary">
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
              {hasBuyRow && <ConfigPriceRow key="buy" priceType="Buy" />}
              {rentalPriceIds.map(rentalPriceId => (
                <ConfigPriceRow
                  key={rentalPriceId}
                  priceType="Rent"
                  rentalPriceId={rentalPriceId}
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
