import { Grid, Paper, Typography, Divider } from "@material-ui/core";
import * as S from "./Post.styled";

export interface RentalPricing {
  period: "Month" | "Months" | "Year" | "Years";
  duration: number;
  price: number;
}
export const inputRentalPeriodOptions = [
  "1 Month",
  "3 Months",
  "6 Months",
  "9 Months",
  "1 Year"
] as const;

export interface BuyPricing {
  price: number;
}
export interface Pricing {
  rentalPricing: RentalPricing[] | undefined;
  buyPrice: BuyPricing | undefined;
}

export interface PostImage extends File {
  preview: string;
}

export interface PostProps {
  title: string | undefined;
  description: string | undefined;
  images: PostImage[];
  pricing: Pricing;
}

export function isRentalPricing(pricing: any): pricing is RentalPricing {
  return pricing
    ? (pricing as RentalPricing).duration !== undefined &&
        (pricing as RentalPricing).period !== undefined
    : false;
}

export function validPrice(price: any): boolean {
  return typeof price === "number" && price > 0 && price < 15000;
}
export function validRentalDuration(duration: number) {
  return duration > 0 && duration < 13;
}
export function validPeriod(period: string) {
  return (
    period === "Month" ||
    period === "Months" ||
    period === "Year" ||
    period === "Years"
  );
}

export function validBuyPricing(buyPrice: any): buyPrice is BuyPricing {
  try {
    console.log(buyPrice);
    return validPrice(buyPrice.price);
  } catch (error) {
    console.log(error);
    return false;
  }
}
export function validRentalPricing(
  rentalPricing: any
): rentalPricing is RentalPricing {
  try {
    return (
      validPrice(rentalPricing.price) &&
      validRentalDuration(rentalPricing.duration) &&
      validPeriod(rentalPricing.period)
    );
  } catch (error) {
    return false;
  }
}
export const TITLE_MAX_LEN = 100;
export const DESCRIPTION_MAX_LEN = 400;
export const MAX_IMAGES = 5;
export const MAX_RENTAL_PRICES = 2;

/**
 * Here we do client side validation of description
 * @param description
 */
export function validDescription(description: string) {
  return description.length > DESCRIPTION_MAX_LEN
    ? {
        error: `Description is must be fewer than ${DESCRIPTION_MAX_LEN} character`
      }
    : {};
}

interface PostWrapperProps {
  Image: React.ReactNode;
  artistName: string;
  Title: React.ReactNode;
  Tags: React.ReactNode;
  Description: React.ReactNode;
  Pricing: React.ReactNode;
}

export function PostWrapper(props: PostWrapperProps) {
  return (
    <Paper
      elevation={3}
      style={{
        padding: 60,
        borderRadius: 10,
        display: "inline-block"
      }}
    >
      <div>
        <Grid container justifyContent="center">
          <Grid item xs="auto">
            <div
              style={{
                display: "inline-block",
                height: 440,
                width: 400,
                marginBottom: 20
              }}
            >
              {props.Image}
            </div>
          </Grid>
        </Grid>
        <Divider style={{ height: 1, marginBottom: 20, marginTop: 10 }} />
        <div>
          <Typography variant="h5">{props.artistName}</Typography>
        </div>
        <S.PostItem>{props.Title}</S.PostItem>
        <S.PostItem>{props.Tags}</S.PostItem>
        <S.PostItem style={{ maxHeight: 200, overflowY: "auto" }}>
          {props.Description}
        </S.PostItem>
        <S.PostItem
          style={{
            borderBottomStyle: "none"
          }}
        >
          {props.Pricing}
        </S.PostItem>
      </div>
    </Paper>
  );
}
