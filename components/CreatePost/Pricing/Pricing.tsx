import { useState } from "react";
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
  Grid
} from "@material-ui/core";
import { Add, BorderStyle, Check, Delete, Edit } from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux-store/store";
import * as BaseForm from "@components/Library/FormField/BaseFormField.styled";
import { DropdownSelection } from "@components/Dropdowns";
import { removeBuyPrice, selectBuyPrice, setBuyPrice } from "./buyPricingSlice";
import { inputRentalPeriodOptions, validRentalPricing } from "../Post";
import {
  removeRentalPrice,
  selectAllRentalPricings,
  selectRentalPricingById,
  upsertRentalPrice
} from "./rentalPricingsSlice";
import { validBuyPricing } from "../CreatePost.api";
import { PriceButtonText, PriceButtonWrapper } from "./PriceButtons";

function ConfigPriceRow(props: {
  priceType: "Rent" | "Buy";
  priceId?: number;
  onRowDelete: (priceType: "Rent" | "Buy", priceId?: number) => void;
}) {
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [period, setPeriod] = useState<"Month" | "Months" | "Year" | undefined>(
    undefined
  );
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const dispatch = useDispatch();

  function onDropdownSelection(itemNumber: number | null) {
    const newRentalPeriod =
      itemNumber !== null ? inputRentalPeriodOptions[itemNumber] : undefined;
    const newDuration = newRentalPeriod?.split(" ")[0];
    const newPeriod = newRentalPeriod?.split(" ")[1];

    if (typeof newDuration === "string") {
      setDuration(parseInt(newDuration, 10));
    }
    if (
      newPeriod === "Month" ||
      newPeriod === "Months" ||
      newPeriod === "Year"
    ) {
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
    if (props.priceType === "Rent" && typeof props.priceId === "number") {
      dispatch(
        upsertRentalPrice({
          rentalPriceId: props.priceId.toString(),
          price,
          duration,
          period
        })
      );
    } else {
      dispatch(
        setBuyPrice({
          price
        })
      );
    }
    setConfirmed(true);
  }
  return (
    <TableRow>
      <TableCell align="left">
        {confirmed && <Check htmlColor="green" />}
      </TableCell>
      <TableCell align="center" component="th" scope="row">
        <Typography variant="body1">{props.priceType}</Typography>
      </TableCell>
      <TableCell align="left" component="th" scope="row">
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
      <TableCell align="right" component="th" scope="row">
        {confirmed ? (
          <Typography>{price}</Typography>
        ) : (
          <BaseForm.AFBaseFormField
            fullWidth={true}
            style={{ maxWidth: 150 }}
            placeholder="Set the Price"
            type="number"
            onChange={e => setPrice(parseInt(e.target.value, 10))}
          />
        )}
      </TableCell>
      <TableCell align="center" component="th" scope="row">
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
      <TableCell align="center" component="th" scope="row">
        <IconButton
          color="primary"
          onClick={() => props.onRowDelete(props.priceType, props.priceId)}
        >
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

type ConfigurePriceTableProps = {
  hasBuyPrice: boolean;
  setHasBuyPrice: any;
  rentalPriceIds: number[];
  setRentalPriceIds: any;
};
export function ConfigurePriceTable(props: ConfigurePriceTableProps) {
  const dispatch = useDispatch();
  function onRowDelete(priceType: string, priceId?: number) {
    if (priceType === "Rent" && typeof priceId === "number") {
      props.setRentalPriceIds((oldRentalPriceIds: number[]) => {
        const newRentalPriceIds = oldRentalPriceIds.filter(
          rentalPriceId => rentalPriceId !== priceId
        );
        return [...newRentalPriceIds];
      });
      dispatch(removeRentalPrice(priceId));
    } else {
      props.setHasBuyPrice(false);
      dispatch(removeBuyPrice());
    }
  }
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left"></TableCell>
            <TableCell align="right">Buy or Rent</TableCell>
            <TableCell align="center">Period</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="left"></TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.hasBuyPrice && (
            <ConfigPriceRow
              key="buy"
              priceType="Buy"
              onRowDelete={onRowDelete}
            />
          )}
          {props.rentalPriceIds.map(priceId => (
            <ConfigPriceRow
              key={priceId}
              priceId={priceId}
              priceType="Rent"
              onRowDelete={onRowDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export function DraftPricing() {
  const { price: buyPrice, error: buyError } = useSelector(selectBuyPrice);
  const rentalPrices = useSelector(selectAllRentalPricings);
  return (
    <Grid container direction="column" spacing={2}>
      {buyPrice !== undefined && buyError === undefined ? (
        <Grid item>
          <PriceButtonWrapper variant="primary">
            <PriceButtonText text={`Buy for $${buyPrice}`} />
          </PriceButtonWrapper>
        </Grid>
      ) : null}
      {rentalPrices.map(({ rentalPriceId, price, duration, period, error }) => (
        <Grid key={rentalPriceId} item>
          {error === undefined && (
            <PriceButtonWrapper variant="secondary">
              <PriceButtonText
                text={`Rent for $${price} Per ${duration} ${period}`}
              />
            </PriceButtonWrapper>
          )}
        </Grid>
      ))}
    </Grid>
  );
}
export function ConfigurePrices() {
  const [hasBuyPrice, setHasBuyPrice] = useState(false);
  const [rentalPriceIds, setRentalPriceIds] = useState<number[]>([]);
  return (
    <Grid container spacing={2} direction="column">
      <Grid item container justifyContent="space-evenly">
        <Grid item xs="auto">
          <Button
            disabled={hasBuyPrice}
            onClick={() => setHasBuyPrice(true)}
            variant="contained"
            color="primary"
          >
            Add Buy Price
          </Button>
        </Grid>
        <Grid item xs="auto">
          <Button
            onClick={() => {
              setRentalPriceIds(oldRentalPriceIds => {
                const newRentalPriceId =
                  oldRentalPriceIds.length !== 0
                    ? Math.max(...oldRentalPriceIds) + 1
                    : 0;
                return [...oldRentalPriceIds, newRentalPriceId];
              });
            }}
            variant="contained"
            color="primary"
          >
            Add Rental Price
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <ConfigurePriceTable
          hasBuyPrice={hasBuyPrice}
          setHasBuyPrice={setHasBuyPrice}
          rentalPriceIds={rentalPriceIds}
          setRentalPriceIds={setRentalPriceIds}
        />
      </Grid>
    </Grid>
  );
}
